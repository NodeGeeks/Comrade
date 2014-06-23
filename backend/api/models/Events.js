/**
* Events.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: 'events',
    schema: true,
    attributes: {
        name: {
            type: 'string',
            required: true,
            columnName: 'name'
        },
        hostUserID: {
            type: 'string',
            required: true,
            columnName: 'hostUserID'
        },
        beginTimestamp: {
            type: 'datetime',
            required: true,
            columnName: 'beginTimestamp'
        },
        endTimestamp: {
            type: 'datetime',
            required: true,
            columnName: 'endTimestamp'
        },
        invited: {
            type: 'array',
            columnName: 'invited'
        },
        attending: {
            type: 'array',
            columnName: 'attending'
        }

    }
};

