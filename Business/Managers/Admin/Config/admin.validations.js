const Joi  = require('joi');
const config = require('../../../../config/config')

module.exports = {  
    createDomain: {
        body: {
        name: Joi.string().required(),
        }
    },
    updateDomain: {
        body: {
        name: Joi.string().required(),
        },
        params: {
            name: Joi.string().required(),
        }
    },
    removeDomain: {
        params: {
            name: Joi.string().required(), 
        }
    },
    createCategory: {
        body: {
        name: Joi.string().required(),
        }
    },
    updateCategory: {
        body: {
        name: Joi.string().required(),
        },
        params: {
            name: Joi.string().required(),
        }
    },
    removeCategory: {
        params: {
            name: Joi.string().required(), 
        }
    },
};
  