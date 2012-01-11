require('express-namespace');

//var model = require('../model/model.js'),
_ = require('../../../node_modules/underscore')._;

exports.boot = function(app){

	app.get('/', function(req, res){
		res.render('seeder/index',{title: 'generate customer data', params:{}, count: 100 });
	});


	app.post('/', function(req, res){
		var params = 
		{
			countries: req.body.countries,
			cities: req.body.cities,
			streets: req.body.streets,
			streetNumbers: req.body.streetNumbers,
			zipCodes: req.body.zipCodes,
			ages: req.body.ages,
			firstNames: req.body.firstNames,
			lastNames: req.body.lastNames,
			genders: req.body.genders,
			emailDomains: req.body.emailDomains,
			mobilePhones: req.body.mobilePhones,
			workPhones: req.body.workPhones,
			homePhones: req.body.homePhones,
		},
		parsed = {
			countries: parseList(params.countries),
			cities: parseList(params.cities),
			streets: parseList(params.streets),
			streetNumbers: parseRanges(params.streetNumbers),
			zipCodes: parseRanges(params.zipCodes),
			firstNames: parseList(params.firstNames),
			lastNames: parseList(params.lastNames),
			genders: parseList(params.genders),
			emailDomains: parseList(params.emailDomains),
			ages: parseRanges(params.ages),
			mobilePhones: parseRanges(params.mobilePhones),
			workPhones: parseRanges(params.workPhones),
			homePhones: parseRanges(params.homePhones),
		},
		count = req.body.count,
		data = _(count).range().map( function(i) { return seedCustomer(parsed); } )
		;

		res.render('seeder/index',{
			title: 'generate customer data',
			params: params,
			parsed: JSON.stringify(parsed),
			count: count,
			data: data,
			result: JSON.stringify(data)
		});
	});
}

function parseList(param){
	if(!param)
		return [];
	return _(param.split(',')).map(function(i) {return trim(i);} );
}

function parseRanges(param){
	if(!param)
		return [];
	return _(parseList(param)).map(function(i) {return parseRange(i);} );
}

function parseRange(param)
{
	var r = param.split('-');
	if(r.length!=2)
		return param;
	return [parseInt(r[0]), parseInt(r[1])];
}

var trimRx = /^\s*([\S\s]*?)\s*$/;

function trim(str){
	return str.replace(trimRx, '$1');
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function seedProperty(list)
{
	var rnd = getRandomInt(0, list.length - 1);
	var item = list[rnd];
	if(_(item).isArray())
		return getRandomInt(item[0], item[1]);
	return item;
}


function seedCustomer(parsed)
{
	var firstName = seedProperty(parsed.firstNames),
	lastName = seedProperty(parsed.lastNames),
	birthDate = new Date(),
	age = seedProperty(parsed.ages);
	birthDate.setDate(birthDate.getDate() - (age * 365 + getRandomInt(0, 364)));
	return {
		firstName: firstName,
		lastName: lastName,
		gender: seedProperty(parsed.genders),
		birthDate: new Date(birthDate.getYear(), birthDate.getMonth(), birthDate.getDay()),
		address: {
			country: seedProperty(parsed.countries),
			city: seedProperty(parsed.cities),
			street: seedProperty(parsed.streets),
			streetNumber: seedProperty(parsed.streetNumbers),
			zipCode: seedProperty(parsed.zipCodes)
		},
		email: (firstName+'').toLowerCase() + '.' + (lastName+'').toLowerCase() + '@' + seedProperty(parsed.emailDomains),
		mobilePhone: seedProperty(parsed.mobilePhones),
		workPhone: seedProperty(parsed.workPhones),
		homePhone: seedProperty(parsed.homePhones),
				
	};
}