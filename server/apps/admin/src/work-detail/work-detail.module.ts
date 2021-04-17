import { tReportInfoKiosk } from '@libs/pacsdb/model/tReportInfoKiosk.model';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { worklist } from 'libs/worklistdb/model/worklist.model';
import { WorkDetailController } from './work-detail.controller';
import { WorkDetailMiddleware } from './work-detail.middleware';
import { WorkDetailService } from './work-detail.service';

@Module({
  // 导入pacs视图模型
  imports: [
    TypeOrmModule.forFeature([tReportInfoKiosk]),
    TypeOrmModule.forFeature([worklist], 'workdb'),
  ],
  controllers: [WorkDetailController],
  providers: [WorkDetailService],
})
export class WorkDetailModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WorkDetailMiddleware).forRoutes('work-detail');
  }
}
