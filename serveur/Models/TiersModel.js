const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const City = require('./CityModel');
const TypeTiers = require('./TypeTiersModel');

const Tiers = sequelize.define(
  "Tiers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Le nom du tiers est requis.",
        },
        len: {
          args: [2, 255],
          msg: "Le nom du tiers doit faire entre 2 et 255 caractères.",
        },
      },
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Ce nom d'utilisateur est déjà pris.",
      },
      validate: {
        notEmpty: {
          msg: "Le nom d'utilisateur ne peut pas être vide.",
        },
      },
    },
    type_tiersID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TypeTiers,
        key: "id",
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Ce code de tiers est déjà utilisé.",
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "L'adresse email doit être valide.",
        },
      },
    },
    tax_identification_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: City,
        key: "id",
      },
    },
    block: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Le mot de passe est requis.",
        },
        len: {
          args: [8, 255],
          msg: "Le mot de passe doit faire au moins 8 caractères.",
        },
      },
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Tiers",
        key: "id",
      },
    },
    activate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "tiers",
    timestamps: false,
  }
);

// Définir la relation avec TypeTiers
Tiers.belongsTo(TypeTiers, { foreignKey: 'type_tiersID' });
Tiers.belongsTo(City, { foreignKey: 'cityID' });

// Auto-référence pour le fournisseur créateur
Tiers.belongsTo(Tiers, { as: 'Creator', foreignKey: 'createdBy' });

module.exports = Tiers;
