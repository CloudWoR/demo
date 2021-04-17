import { DataTypes, Model } from 'sequelize'
class commonFields extends Model {}
export default {
  attributes: {
    fields: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    diseases: DataTypes.TEXT,
    fieldsType: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true,
        notEmpty: true,
        isIn: [['临床诊断', '病史', '补充说明']]
      }
    },
    heat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keyword: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortcutCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isAlpha: true,
        isUppercase: true,
        notNull: true
      }
    }
  },
  options: {
    commonFields
  }
}

/**
 * fields：字段文字
 * diseases：疾病名称
 * fieldsType：字段类型：（临床诊断，病史，补充说明）
 * heat：热度
 * keyword：关键字
 * shortcutCode：快捷码
 */
