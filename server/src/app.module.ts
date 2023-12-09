import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guard';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { AssetModule } from './asset/asset.module';
import { ProductModule } from './product/product.module';

import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';
import { AddressModule } from './address/address.module';
import { PromotionModule } from './promotion/promotion.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule,
    CloudinaryModule,
    RoleModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AssetModule,
    ProductModule,
    RateModule,
    AddressModule,
    PromotionModule,
    OrderModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    AppService,
    Logger
  ],
})
export class AppModule { }
