/**
 * Created by rob on 1/24/2017.
 */
"use strict";

const router = require('koa-router')(),
    data = require('./dummyData'),
    url = require('url');

const userCache = [];


//Set up router
//Set up requests

const filterObj = (arry,prop,val) => {
    return arry.filter(obj => {
        return obj[prop] === val
    });
} ;

const getAge = (DOB) =>  {
    let today = new Date();
    let birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }

    return age;
};



router.get("/api/age", (ctx,next) =>{

    let queryString = url.parse(ctx.originalUrl,true);
    let queryBody = queryString.query;
    let id = parseInt(queryBody.id);

    console.log('queryBody', queryBody);

    let found = [];
    found = filterObj(userCache,'id', id );
    if(found.length){
        const [person] = found;
        ctx.body = JSON.stringify(person);
    }

    else{
        found = filterObj(data.IdData,'id', id );
        if(found.length){
            const [person] = found;
            const {id} = person;
            const dob = data.BrirthDayById[id][id];
            person.age = getAge(dob);
            userCache.push(person);
            ctx.body = JSON.stringify(person);
        }
        else{
            ctx.body = JSON.stringify(found);
        }


    }
    ctx.type = "application/json";

});

router.get("/api/ids", (ctx,next) =>{

    ctx.body = JSON.stringify(Object.keys(data.BrirthDayById));
    ctx.type = "application/json";

});

module.exports = router;



