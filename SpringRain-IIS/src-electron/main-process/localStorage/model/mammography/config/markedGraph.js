import { DataTypes, Model } from 'sequelize'
class markedGraph extends Model {}
export default {
  attributes: {
    name: DataTypes.STRING, // 图形名称
    url: DataTypes.STRING, // 路径
    base64: DataTypes.TEXT, // 图像的base64数据
    pathology: DataTypes.STRING, // 病理名称,
    additional: DataTypes.STRING, // 附加在图像上的字段
    type: DataTypes.ENUM(['标识', '背景'])
  },
  options: {
    markedGraph
  }
}
