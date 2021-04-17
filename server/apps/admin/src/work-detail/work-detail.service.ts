import { tReportInfoKiosk } from '@libs/pacsdb/model/tReportInfoKiosk.model';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { v_worklist_viewer } from 'libs/worklistdb/model/v_worklist_viewer.model';
import { worklist } from 'libs/worklistdb/model/worklist.model';
import * as moment from 'momnet';
import { Repository, FindConditions, Between, In, Not } from 'typeorm';
import { dateFormatDto, findWorklistDto } from './dto/index.dto';

interface baseFindDTO {
  date?: string;
  limit?: number;
  primaryKey?: 'modality' | 'sourceOfPatient';
  secondaryKey?: 'modality' | 'sourceOfPatient';
  where?: FindConditions<tReportInfoKiosk>;
}

@Injectable()
export class WorkDetailService {
  constructor(
    private scheduleRegistry: SchedulerRegistry,
    @InjectRepository(tReportInfoKiosk)
    private readonly pacs: Repository<tReportInfoKiosk>,
    @InjectRepository(worklist, 'workdb')
    private readonly workdb: Repository<worklist>,
    @InjectRepository(v_worklist_viewer, 'workdb')
    private readonly v_worklist: Repository<v_worklist_viewer>,
  ) {}
  /**
   * 需求：
   *  1，获取当天全部工作列表
   *    1）全部获取
   *    2）根据设备分类
   *    3）根据患者类型分类
   *  2、获取当天全部阳性率
   *    1）全部获取
   *    2）根据设备类型分类
   *    3）根据患者类型分类
   *  3、获取检查完成时间、
   *    1）全部获取
   *    2）根据设备分类
   *    3）根据患者类型分类
   */
  // 基本获取函数，传入日期、分类关键字后，去获取pacs
  async baseFind(options: baseFindDTO): Promise<any> {
    const result = await this.pacs.findAndCount({
      select: [
        'RISPID',
        'AccessionNumber',
        'PatientCName',
        'PatientType',
        'Age',
        'Sex',
        'Modality',
        'ModalityType',
        'DJTime',
        'DJTime',
        'status',
        'StudyDateTime',
        'ReportDateTime',
        'ApproveDateTime',
        'Registrar',
        'Technician',
        'ReportDoctor',
        'ReportApprover',
        'Enhance',
        'IsPositive',
      ],
      where: options.where,
    });
    return result;
  }

  // 初始化本地数据库
  async initail(targetDate: dateFormatDto): Promise<number> {
    const job = this.scheduleRegistry.getCronJob('updateWorklist');
    job.stop();
    const getPacs = await this.baseFind({
      where: {
        DJTime: Between(targetDate.startDate, targetDate.endDate),
        Registrar: Not(In(['代永兵', '康舒雅', '陈雪', '薛惠玲'])),
      },
    });
    let updateCount = 0;
    if (!getPacs.length && !getPacs[0].length) return 0;
    await this.workdb.delete({
      StudyDateTime: Between(targetDate.startDate, targetDate.endDate),
    });
    for await (const work of getPacs[0]) {
      await this.workdb
        .save(work)
        .then(() => {
          updateCount++;
        })
        .catch(async (error) => {
          if (error.code === 'ER_DUP_ENTRY') return;
          throw new Error(error);
        });
    }
    job.start();
    return updateCount;
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'updateWorklist' })
  async regularUpdate(): Promise<void> {
    const targetDate: dateFormatDto = {
      startDate: moment().format('YYYY-MM-DD 00:00:00'),
      endDate: moment().format('YYYY-MM-DD 23:59:59'),
    };
    await this.initail(targetDate);
    console.log('定时更新', moment().format('hh:mm:ss'));
  }

  // 获取详细工作情况，获取指定天数，或者获取所有天数
  async baseGetWorkStatus(
    options: findWorklistDto,
  ): Promise<v_worklist_viewer[]> {
    const result = await this.v_worklist.find({
      where: options.where,
    });
    console.log('result: ', result);
    return result;
  }

  async getWorkStatus(options: findWorklistDto): Promise<v_worklist_viewer[]> {
    const result = await this.baseGetWorkStatus(options);
    return result;
  }
}
