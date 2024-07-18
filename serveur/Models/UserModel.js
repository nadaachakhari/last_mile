const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RoleUser = require('./RoleUserModel');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom de l\'utilisateur ne peut pas être vide.',
      },
    },
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Ce nom d\'utilisateur est déjà pris.',
    },
    validate: {
      notEmpty: {
        msg: 'Le nom d\'utilisateur ne peut pas être vide.',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le mot de passe ne peut pas être vide.',
      },
      len: {
        args: [8, 255],
        msg: 'Le mot de passe doit faire au moins 8 caractères.',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Cet email est déjà associé à un compte.',
    },
    validate: {
      notEmpty: {
        msg: 'L\'email ne peut pas être vide.',
      },
      isEmail: {
        msg: 'L\'email doit être une adresse email valide.',
      },
    },
  },
  photo: {
    type: DataTypes.TEXT,
  },
  registration_number: {
    type: DataTypes.STRING,
  },
  cin: {
    type: DataTypes.STRING,
  },
  role_usersID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RoleUser,
      key: 'id',
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Define the relationship
User.belongsTo(RoleUser, { foreignKey: 'role_usersID' });

module.exports = User;
