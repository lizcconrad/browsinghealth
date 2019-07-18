const { GraphQLServer } = require('graphql-yoga');
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
require('dotenv').config();

// Connect to the MongoDB using either the Heroku URI or localhost
mongoose.connect(process.env.MONGODB_URI);

//MONGOOSE SCHEMAS
// each schema represents one collection in the database
// the fields match the fields for the documents in each respective collection
//#region
var trialSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    condition: String,
    studies: Number,
    sctid: String,
    nct_ids: [String]
});
var interventionSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    condition: String,
    intervention_type: String,
    intervention_name: String,
    count: Number,
    sctid: String,
    nct_ids: [String]
});
var outcomeSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    condition: String,
    measure: String,
    count: Number,
    sctid: String,
    nct_ids: [String],
    time_frame: String,
});
var fulltrialSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    nct_id: String,
    brief_title: String,
    overall_status: String,
    enrollment: Number,
    start_date: String,
    primary_completion_date: String,
    criteria: String,
    gender: String,
    minimum_age: String,
    maximum_age: String,
    countries: [String],
    study_first_submitted: String,
    last_update_submitted: String,
    last_update_posted: String,
});
var publicationSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    nct_id: String,
    condition: String,
    type: String,
    pmid: String,
    citation: String
});
//#endregion
   
// using the mongoose schemas, create mongoose models. These are what are used to make queries
// the parameters are mongoose.model('Model_Name, schema, collection_name)
// the collection name tells mongoose which collection in the database to associate this model with 
var Trials = mongoose.model('Trials', trialSchema, 'trials');
var Interventions = mongoose.model('Interventions', interventionSchema, 'interventions');
var Outcomes = mongoose.model('Outcomes', outcomeSchema, 'outcomes');
var FullTrials = mongoose.model('FullTrials', fulltrialSchema, 'full_trials');
var Publications = mongoose.model('Publications', publicationSchema, 'publications');


// GRAPHQL TYPEDEF
// these are the definitions for the possible GraphQL objects that can be returned
// in this case, there is one typedef for each document format in each collection of the database
// e.g., there is a typedef for "Trial" which returns all the fields in the exact format of the documents in the trials collection of the database

// in addition to these standard typedefs, there are a few types that are composed with computed fields for convenience in using the data
// these include: TypeInfo, SumCondition, and NCT
// TypeInfo: a count of the number of interventions of the given type for a particular condition (the "id" is the intervention type, e.g. "Drug")
// SumCondition: a count of the number of trials of the given aggregate condition (the "id" is an sctid and the count is all trials for every condition with that sctid)
// NCT: a type that has a condition, number of studies for that condition, and a list of every NCT ID associated with that condition
//#region
const typeDefs = `
    type Query {
        conditionSingle(condition: String): [Trial]
        conditionSearch(condition: String): [Trial]
        conditions_sctid(sctid: String): [SumCondition]
        conditions(sctid: String): [Trial]

        interventions(condition: String, sctid: String = null, intervention_type: String = null): [Intervention]
        typeDistribution(condition: String): [TypeInfo]

        outcomes(condition: String, sctid: String = null): [Outcome]

        full_trial(nct_id: String): [FullTrial]

        nct_ids(condition: String, sctid: String = null): [NCT]

        publications(condition: String): [Publication]
        
    }
    

    type Trial {
        id: ID!
        condition: String
        studies: Int
        sctid: String
        nct_ids: [String]
    }

    type Intervention {
        id: ID!
        condition: String
        intervention_type: String
        intervention_name: String
        count: Int 
        sctid: String
        nct_ids: [String]
    }

    type Outcome {
        id: ID!
        condition: String
        measure: String
        count: Int
        sctid: String
        nct_ids: [String]
        time_frame: String
    }

    type Publication {
        id: ID!
        nct_id: String
        condition: String
        type: String
        pmid: String
        citation: String
    }

    type FullTrial {
        id: ID!
        nct_id: String
        brief_title: String
        overall_status: String
        enrollment: Int
        start_date: String
        primary_completion_date: String
        criteria: String
        gender: String
        minimum_age: String
        maximum_age: String
        countries: [String]
        study_first_submitted: String
        last_update_submitted: String
        last_update_posted: String
    }

    type TypeInfo {
        _id: String!
        count: Int
    }

    type SumCondition {
        _id: String!
        studies: Int
    }

    type NCT {
        _id: ID!
        condition: String
        studies: Int
        nct_ids: String
    }
`
//#endregion

// Resolvers for the GraphQL queries. This tells GraphQL how exactly to go about getting the desired data for each query
const resolvers = {
    Query: {
        // conditionSingle: used to get the entry in the "trials" collection for the given condition
        conditionSingle: (_, { condition }) => Trials.find({condition: condition}).limit(1),

        // conditionSearch: used to get a list of conditions whose name contains the matching string (used for the search bar)
        conditionSearch: (_, { condition }) => Trials.find({condition: {'$regex': '.*' + condition + '.*'}}).sort({count: -1}),

        // conditions_sctid: gets a count of the trials across conditions with a matching sctid
        conditions_sctid: (_, { sctid }) => Trials.aggregate([
            {$match: {sctid: sctid}},
            {$group: {_id: sctid, studies: {$sum: "$studies"}}}
        ]),

        // conditions: gets each entry in the "trials" collection for the conditions of the given sctid 
        conditions: (_, { sctid }) => Trials.find({sctid: sctid}).sort({studies: -1}),

        // nct_ids: get's a list of all the nct_ids for the given condition (including those with a matching sctid if there's an associated sctid)
        nct_ids: (_, { condition, sctid }) => {
            if(sctid == null) {
                return Trials.aggregate([
                    {$unwind: "$nct_ids"},
                    {$match: {condition: condition}}
                ]);
            } else {
                return Trials.aggregate([
                    {$unwind: "$nct_ids"},
                    {$match: {sctid: sctid}}
                ]);
            }
        },
        
        // interventions: gets a list of interventions in the "interventions" collection based on the given condition (and aggregates by sctid if available)
        interventions: (_, { condition, sctid, intervention_type }) => {
            if(sctid == null) {
                if(intervention_type == null || intervention_type == "overall") {
                    return Interventions.find({condition: condition}).sort({count: -1})
                } else {
                    return Interventions.find({condition: condition, intervention_type: intervention_type}).sort({count: -1})
                }
            } else {
                if(intervention_type == null || intervention_type == "overall") {
                    return Interventions.find({sctid: sctid}).sort({count: -1})
                } else {
                    return Interventions.find({sctid: sctid, intervention_type: intervention_type}).sort({count: -1})
                }
            }
        },

        // typeDistribution: counts the number of interventions of a certain type for a given condition
        typeDistribution: (_, { condition }) => Interventions.aggregate([
            {$match: {condition: condition}},
            {$group: {_id: "$intervention_type", count: {$sum: "$count"}}}
        ]),

        // outcomes: gets a list of outcomes in the "outcomes" collection based on the given condition (and aggregates by sctid if available)
        outcomes: (_, { condition, sctid }) => {
            if(sctid == null) {
                return Outcomes.find({condition: condition}).sort({count: -1})
            } else {
                return Outcomes.find({sctid: sctid}).sort({count: -1})
            }
        },

        // full_trial: gets a full_trial entry given an nct_id
        full_trial: (_, { nct_id }) => FullTrials.find({nct_id: nct_id}).limit(1),

        // gets a list of publications in the "publications" collection based on the given condition
        publications: (_, { condition }) => Publications.find({condition: condition})
    },
}

// create the server with the typeDef and resolver information
const server = new GraphQLServer({ typeDefs, resolvers });

// express.static is responsible for static file requests to the client
// when a request is made, it will now look in the build folder
server.express.use(express.static(path.join(__dirname, "client", "build")))

// send index.html if a request that isn't recognized is received
server.express.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


const port = process.env.PORT || 4000

const options = {
    port: port
    }
    
server.start(options, ({ port }) =>
    console.log(
        `Server started, listening on port ${port} for incoming requests.`,
    ),
);