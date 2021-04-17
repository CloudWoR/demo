import { LocalDbModule } from '@libs/local-db';
import { PacsdbModule } from '@libs/pacsdb';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { SignImageModule } from './sign-image/sign-image.module';

@Module({
  imports: [LocalDbModule, ReportModule, PacsdbModule, SignImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
