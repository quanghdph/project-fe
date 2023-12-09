import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigOptions, v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [{
    provide: 'Cloudinary',
    useFactory: (config: ConfigService): ConfigOptions => {
      return v2.config({
        cloud_name: config.get('CLOUDINARY_NAME'),
        api_key: config.get('CLOUDINARY_API_KEY'),
        api_secret: config.get('CLOUDINARY_API_SECRET'),
      });
    },
    inject: [ConfigService]
  },
    CloudinaryService
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule { }
