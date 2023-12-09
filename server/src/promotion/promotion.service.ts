import { Injectable } from '@nestjs/common';
import { IResponse } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckPromotionCodeDto, PromotionCreateDto, PromotionUpdateDto } from './dto';
import { promotion } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) { }

  public async create(input: PromotionCreateDto): Promise<IResponse<promotion>> {
    try {
      const { active, coupon_code, discount, ends_at, limit, name, starts_at } = input;
      const isCouponCodeExist = await this.prisma.promotion.findUnique({
        where: { coupon_code },
      });
      if (isCouponCodeExist) {
        return {
          code: 400,
          success: false,
          message: 'Coupon code already exist!',
          fieldError: "coupon_code",
        };
      }
      return {
        code: 200,
        success: true,
        message: 'Success!',
        data: await this.prisma.promotion.create({
          data: {
            active,
            coupon_code,
            discount,
            ends_at,
            limit,
            name,
            starts_at
          }
        })
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

  public async promotions(input: PaginationDto): Promise<IResponse<{ promotions: promotion[], totalPage: number, skip: number, take: number, total: number }>> {
    const { skip, take, search, status } = input;
    const [totalRecord, promotions] = await this.prisma.$transaction([
      this.prisma.promotion.count({
        where: {
          ...search && {
            OR: [
              {
                name: {
                  contains: search
                }
              },
              {
                coupon_code: {
                  contains: search
                }
              }
            ]
          },
          ...status && status !== 'all' && {
            active: status === 'active' ? true : false
          },
        }
      }),
      this.prisma.promotion.findMany({
        take: take || 10,
        skip: skip || 0,
        where: {
          ...search && {
            OR: [
              {
                name: {
                  contains: search
                }
              },
              {
                coupon_code: {
                  contains: search
                }
              }
            ]
          },
          ...status && status !== 'all' && {
            active: status === 'active' ? true : false
          },
        }
      }),
    ])
    return {
      code: 200,
      success: true,
      message: "Success!",
      data: {
        promotions,
        totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
        total: totalRecord,
        skip: skip || 0,
        take: take || 10
      }
    }
  }

  public async delete(id: number): Promise<IResponse<promotion>> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id }
      })
      if (promotion) {
        return {
          code: 200,
          message: 'Delete successfully!',
          success: true,
          data: await this.prisma.promotion.delete({ where: { id } })
        }

      }
      return {
        code: 404,
        message: 'Promotion does not exist in the system!',
        success: false,
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

  public async promotion(id: number): Promise<IResponse<promotion>> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id }
      })
      if (promotion) {
        return {
          code: 200,
          message: 'Success',
          success: true,
          data: promotion
        }
      }
      return {
        code: 404,
        message: 'Promotion does not exist in the system!',
        success: false,
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

  public async update(id: number, input: PromotionUpdateDto): Promise<IResponse<promotion>> {
    try {
      const { active, coupon_code, discount, ends_at, limit, name, starts_at } = input;
      const promotion = await this.prisma.promotion.findUnique({
        where: { id }
      })
      if (promotion) {
        if (coupon_code) {
          const isCouponCodeExist = await this.prisma.promotion.findFirst({
            where: {
              AND: [
                { coupon_code },
                {
                  NOT: [
                    { id }
                  ]
                }
              ]
            },
          })
          if (isCouponCodeExist) {
            return {
              code: 400,
              success: false,
              message: 'Coupon code already exist!',
              fieldError: "coupon_code",
            }
          }
        }
        return {
          code: 200,
          success: true,
          message: 'Success!',
          data: await this.prisma.promotion.update({
            where: { id },
            data: {
              ...coupon_code && { coupon_code },
              ...discount && { discount },
              ...ends_at && { ends_at },
              ...limit && { limit },
              ...name && { name },
              ...starts_at && { starts_at },
              active,

            },
          })
        }
      }
      return {
        code: 404,
        message: 'Promotion does not exist in the system!',
        success: false,
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

  public async checkPromotionCode(input: CheckPromotionCodeDto): Promise<IResponse<promotion>> {
    try {
      const { coupon_code } = input
      const promotion = await this.prisma.promotion.findUnique({
        where: { coupon_code }
      })
      if (promotion) {
        if (promotion.limit === 0) {
          return {
            code: 400,
            message: 'Promotion has been out of code!',
            success: false,
            fieldError: "coupon_code",
          }
        }
        if (!promotion.active) {
          return {
            code: 400,
            message: 'Promotion has been disabled!',
            success: false,
            fieldError: "coupon_code",
          }
        }
        if (new Date(promotion.ends_at).getDate() - new Date().getDate() < 0) {
          return {
            code: 400,
            message: 'Promotion out of date!',
            success: false,
            fieldError: "coupon_code",
          }
        }
        return {
          code: 200,
          message: 'Success',
          success: true,
          data: promotion
        }
      }
      return {
        code: 404,
        message: 'Promotion does not exist in the system!',
        success: false,
        fieldError: "coupon_code",
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

}
