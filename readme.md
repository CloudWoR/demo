# 影像科工作量统计系统
```tip
  影像科工作量统计系统用于自动查询并汇总每日检查数据，并计算出每一个环节（检查，报告，审核 ）的平均完成时间。
```
## 主要功能如下：
1. 自动获取pacs数据库中的内容——tReportInfoKiosk视图
2. 根据“患者类型、设备类型、设备、日期”进行分类汇总
3. 将分类后的数据存储至本地数据库，同时自动查询pacs数据库并覆盖旧值
4. 将平均完成时间渲染成曲线图形成数据可视化功能
5. 将每台设备的检查人次展示成饼状图
6. 权限管理，由管理员分配不同角色，其权限不同或相同。

## 设计架构
```tip
  项目分为前端和后端两部分组成
```
1. 前端：
  目录：SpringRain-IIS
  由electron配合quasarUI库构建
2. 后端：
  目录：server
  由nestjs配合mongoDB + mySql构建

## 环境搭建方法
1. 数据库：
    创建两个mySql数据库: pacs, worklist, 其中pacs为模拟远程数据库，需要根据“pacs数据库.xlsx”文件创建，并导入。worklist数据库仅需在本地创建worklist库，无需创建表，
  表创建由server端自动完成。
2. 前端开发环境：
    根据前端根目录下的**package.json**文件，运行"yarn install"命令，前提是必须全局安装electron-11.2及nodejs>=12以及quasar cli
3. 后端开发环境：
  同样根据根目录下的**package.json**文件，运行"yarn install"命令，前提是必须全局安装nestjs-cli。

## 主要修改目录
1. 前端代码
仅需关注“\src\pages\home”部分，其余代码需要在完成后删除。
2. 后端
仅需关注amdin下的代码，若需要扩展功能，可以将server下的代码修改后扩展。