import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { CustomersController } from './customers/customers.controller';
import { ProductsService } from './products/products.service';
import { CustomersService } from './customers/customers.service';
import { ProductsModule } from './products/products.module';
import { TagsModule } from './tags/tags.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './tags/tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/users.entity';
import { Products2Controller } from './products2/products2.controller';
import { Products2Service } from './products2/products2.service';
import { Products2Module } from './products2/products2.module';
import { Producto } from './products2/produc.entity';
import { SizeController } from './size/size.controller';
import { SizesService } from './size/size.service';
import { SizeModule } from './size/size.module';
import { SizesEntity } from './size/size.entity';




@Module({
  imports: [ProductsModule, TagsModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'backend',
    entities:[User,Producto,SizesEntity],
    synchronize: true,
    logging: true,
    autoLoadEntities: true,


  }), UserModule, Products2Module, SizeModule],
  controllers: [AppController, ProductsController, CustomersController],
  providers: [AppService, ProductsService, CustomersService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }],
})
export class AppModule {}
