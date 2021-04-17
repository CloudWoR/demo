import { Sequelize, DataTypes } from 'sequelize'

const ID_TYPE = DataTypes.UUID

class DB {
  constructor (sequelize) {
    this.sequelize = sequelize
  }

  defineModel (name, model) {
    const { attributes, options } = model
    options.paranoid = true
    const attrs = {}
    console.log('defineMode: ', model)
    for (const key in attributes) {
      const value = attributes[key]
      if (typeof value === 'object' && value.type) {
        value.allowNull = value.allowNull || false
        attrs[key] = value
      } else {
        attrs[key] = {
          type: value,
          allowNull: false
        }
      }
    }
    attrs.id = {
      type: ID_TYPE,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    }
    attrs.createdAt = {
      type: DataTypes.TIME,
      allowNull: false
    }
    attrs.updatedAt = {
      type: DataTypes.TIME,
      allowNull: false
    }
    attrs.version = {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    // return this.sequelize.define(name, attrs, {
    //   tableName: name,
    //   timestamps: false,
    //   hooks: {
    //     beforeValidate: function (obj) {
    //       const now = Date.now()
    //       if (obj.isNewRecord) {
    //         obj.createdAt = now
    //         obj.updatedAt = now
    //         obj.version = 0
    //       } else {
    //         obj.updatedAt = Date.now()
    //         obj.version++
    //       }
    //     }
    //   }
    // }, {
    //   ...options,
    //   sequelize: this.sequelize,
    //   paranoid: true
    // })
    options[name].init(attrs, {
      sequelize: this.sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      hooks: {
        beforeValidate: obj => {
          const now = Date.now()
          if (obj.isNewRecord) {
            obj.createdAt = now
            obj.updatedAt = now
            obj.version = 0
          } else {
            obj.updatedAt = Date.now()
            obj.version++
          }
        }
      }
    })
    return options[name]
  }
}

export default DB
