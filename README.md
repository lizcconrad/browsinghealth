# BrowsingHealth README
This document contains a detailed description of all of the architecture and code in the BrowsingHealth project. The code for the website itself is found in this repository. The code for the python and bash scripts to build the database can be found at [this](https://github.com/lizcconrad/bh-py-scripts) repository.

1. [Development and Deployment](#development-and-deployment)
2. [React](#react-ui)
   - [index.js](#indexjs)
   - [App](#app)
   - [CustomNavbar](#customnavbar)
   - [Page](#page)
   - [Home](#home)
   - [SeachBar](#searchbar)
   - [ConditionList](#conditionlist)
   - [ConditionListItem](#conditionlistitem)
   - [ConditionPage](#conditionpage)
   - [TabHolder](#tabholder)
   - [Tab](#tab)
   - [CustomTabContent](#customtabcontent)
   - [InterventionDisplay](#interventiondisplay)
   - [SelectForm](#selectform)
   - [InterventionTable](#interventiontable)
   - [DataTable](#datatable)
   - [List](#list)
   - [ListItem](#listitem)
   - [DistributionDisplay](#distributiondisplay)
   - [TypeChart](#typechart)
   - [OutcomeDisplay](#outcomedisplay)
   - [OutcomeTable](#outcometble)
   - [PublicationDisplay](#publicationdisplay)
   - [PublicationTable](#publicationtable)
   - [MatchingDisplay](#matchingdisplay)
   - [MatchingTable](#matchingtable)
   - [RelatedPane](#relatedpane)
   - [ShowMore](#showmore)
3. [GraphQL Server](#graphql-server)
4. [Database Description](#database-description)
   - [full_trials](#full_trials)
   - [trials](#trials)
   - [interventions](#interventions)
   - [outcomes](#outcomes)
   - [publications](#publications)
5. [Python Scripts](#python-scripts)
   - [full_trials.py](#full_trialspy)
   - [trials.py](#trialspy)
   - [interventions.py](#interventionspy)
   - [outcomes.py](#outcomespy)
   - [publications.py](#publicationspy)
   - [aggregation.py](#aggregationpy)
6. [Bash Scripts](#bash-scripts)
   - [populate_mongo.sh](#populate_mongosh)
   - [sctid.sh](#sctidsh)
7. [Additional Notes](#additional-notes)

## Development and Deployment
The first section of the document explains how to go about deploying updates to the website. Using Heroku, it's relatively painless to get the site up and running. The guide I used to do this is found [here](https://coursework.vschool.io/deploying-mern-with-heroku/). The current version of the app is live at [https://browsinghealth.herokuapp.com/]().

#### Developing on your local machine
In order to develop on your local machine, all you need to do is clone the repo and create a `.env` folder with a value for the `MONGODB_URI` environment variable.

Once that is set up, navigate to the directory of the repo and run `npm install` or `yarn install`, depending which package manager you use.  Do the same thing in the `client` folder. After this, still in the `client` folder, run `npm dev` (or `yarn dev`). From here, the app will open in a browser and it will update in real time with any changes.

#### Interface and Server updates
Deploying an update to the actual interface or server could not be simpler. All you need to do is change the code as you wish, and push to the master branch of the repo. Heroku is set up to automatically deploy any updates when there is a push to the master branch. That's it, you're done!

#### Database updates
In order to update the database, you'll have to login to the MongoLabs instance that the app uses through your terminal. From there you can work with the database as you would any mongo database.


## React UI

The interface of this app is built using [React](https://reactjs.org/). The structure of the `src` folder for the UI is as follows:

```
.
+-- common
|   +-- CustomNavbar.js
|   +-- Page.js
+-- condition
|   +-- ConditionPage.js
|   +-- CustomTabContent.js
|   ...
+-- home
|   +-- Home.js
|   +-- SearchBar.js
|   ...
```

The `common` folder contains components that are used across all screens of the app. The `home` folder contains components that are used on the homepage of the website. The `condition` folder contains components that are used on the condition description pages of the website.

Each component will be described below.

### Highlevel components

#### index.js
This is the most abstract component in the application. Its sole function is to render the `App` component. In this case, the `App` component is wrapped in an `ApolloProvider`, which handles our GraphQL queries.

#### App
This component renders a `BrowserRouter` component which is used to render particular components based on the URL path. For example, our app renders the `Home` component for the path `/` and it renders a `ConditionPage` component for a path such as `/condition/stroke`

Additionally, at the top of the file is an array of condition names. These conditions were chosen to be important conditions with a special access link from the homepage. If you want to change what conditions appear in the Quick Access section, just change what conditions appear in this array.

### Components in `/common`

#### CustomNavbar
`CustomNavbar` uses 'Navbar' and related components from the [reactstrap](https://reactstrap.github.io/) library to build a navbar.

#### Page
This component is the skeleton for all "pages" on the app. It renders a `CustomNavbar` component in the header and then the `main` element renders the child component, which will be something like a `Home` or `ConditionPage` component.

### Components in `/home`

#### Home
This component renders the homepage of the site. It uses a Page component as a wrapper and inside places the condition `SearchBar` and the Quick Access `ConditionList`.

#### SearchBar
This is the component for the condition searchbar on the homepage. This component utilizes something called `AsyncTypeahead` which allows for the options shown in the dropdown beneath the searchbar to update as the user types in a condition.

#### ConditionList
This component is the wrapper component that renders a list of `ConditionListItem` components, which are what are seen on the home page in the Quick Access section.

#### ConditionListItem
This component is an individual item in the list of conditions in the Quick Access section. At the top of the file there is a GraphQL query that is used to get the sctid (if there is one) for the condition string for the item. This sctid is later used on the `ConditionPage` in order to aggregate conditions with differeing strings but that were determined to be the same by investigating the SNOMED database.

### Components in `/condition`

#### ConditionPage
This is the top level component for the page which displays information about a given condition/sctid. Currently, only a handful of conditions have been assigned an sctid. As a result, if the given condition has an sctid, the page will display aggregate information about that condition and all other conditions that share the same sctid. Otherwise, it shows information for that condition alone.

The top of the file has a number of GraphQL queries that are used to obtain the aggregate count information concerning number of studies, interventions, and outcomes. For getting the number of studies for the condition, there are two different queries, whereas there's only one query for number of interventions and outcomes. This is explained in point 1 in the [additional notes](#notes).

The component also contains an array of tab information for the tabbed display on the lefthand side of the page. If you want another tab or to remove a tab, simply edit this array. Each entry contains an `id` (for the DOM element of the tab), a `content-id` (for the DOM element of the content within the tab), a `title` (displayed on the tab), and `active` (only passed for the default active tab as `true`, it is left out and assumed `false` for all other tabs).

The `TabHolder` component takes the tabs array and has a child component for each tabbed display. So far, the precedent is to create a new component for each tabbed display. This seemed to be the simplest approach to modularity but is not a requirement and likely could be improved.

#### TabHolder
This is a wrapper component for the tabs in the tabbed display. It takes the "tabs" array from its parent (in this case `ConditionPage`) and maps each element to a `Tab` component. The new array of `Tab` components is the child of a `Nav` from `reactstrap`. The `TabContent` component (also from `reactstrap`) takes `this.props.children` as its child. In this case, those children are the tab display components that were specified in `ConditionPage`.

#### Tab
The component which renders the tab itself using the props sent in from the parent, `TabHolder`.

#### CustomTabContent
A div wrapper that takes the id and active status from the parent and determines whether to show the div based on this information. A separate component was made for the purpose of not having to paste this div behavior every time a new tab component is made.

#### InterventionDisplay
This component contains all the content for the Interventions tab, such as the table with the interventions and their counts listed which, when expanded, displays links to the specific trials that used that intervention. It also has the distribution chart for how many interventions of each type are used on this condition.

#### SelectForm
The component for the dropdown menu on the Interventions tab to switch between which category of interventions is displayed in the `InterventionTable`.

#### InterventionTable
The table that displays the intervention information (intervention name, number of trials that use that intervention, and links to the trials that use it). The table is built using the `DataTable` component.

#### DataTable
This component takes data passed in from the parent component and displays a data table using the `ReactTable` component from `react-table`, found [here](https://www.npmjs.com/package/react-table).

#### List
Used as a the `SubComponent` property in the `ReactTable` in `DataTable`. Maps the `nct_ids` of a particular intervention into `ListItem` components that are displayed when the particular intervention in the table is expanded.

#### ListItem
Uses the passed in `nct_id` to build a link to clinicaltrials.gov and displays it.

#### DistributionDisplay
This component contains the chart of the percentage distribution of the types of interventions for the given condition.

#### TypeChart
This is the chart that displays the intervention distribution for the condition. The chart uses the [react-chartjs-2 library](https://www.chartjs.org/docs/latest/). At the top of this component are arrays that contain the labels and colors for the chart. The componentDidMount() function (which is contrasted with render() in [this](https://www.codingame.com/playgrounds/8747/react-lifecycle-methods-render-and-componentdidmount) article) updates the state of the component with the data returned from the TYPE_DISTRIBUTION GraphQL query. This triggers render to be called again, which displays the chart with the data that's now been saved in the state.

#### OutcomeDisplay
This component contains the table for the Outcomes tab. The table, a `DataTable` component, displays each outcome and its count and provides links to the associated clinical trials if expanded.

#### OutcomeTable
The table that displays the outcomes information (outcome measure, number of trials that use that outcome, and links to the trials that use it). The table is built using the `DataTable` component.

#### PublicationDisplay
This component contains the table for the Publications tab. The table, a `DataTable` component, displays each citation and a link to the publication itself.

#### PublicationTable
The table that displays the publication information (citation and link to the publication). The table is built using the `DataTable` component. Note that in this table, unlike the tables for interventions/outcomes, the data returned from the query must be mutated silghtly before being put in the table.

#### MatchingDisplay
This component contains the table for the list of conditions whose data are aggregated on this page. This table is built using the SNOMED IDs in the database. For example, "heart failure" and "cardiac failure" are considered the same condition in the SNOMED database, so the data for trials of both of those conditions is displayed together on the same page in BrowsingHealth.

#### MatchingTable
This is the table that displays the list of matching conditions based on sctids. The table is built using the `DataTable` component.

#### RelatedPane
This component is shown in the top righthand corner of the page. It shows a list of conditions that are related to the currently viewed condition. As of right now, it just shows conditions that have the string for the current condition in their name (e.g. a related condition to Asthma would be Chronic Asthma).

#### ShowMore
This is the collapsable list component at the bottom of the RelatedPane. Because some conditions have a very large amount of related conditions, it's advantageous to only show a small number of them by default, and hide the rest in a collapsable list.


## GraphQL Server
The code for the server is all located in `index.js` in the top directory. This file defines the GraphQL definitions for the objects that can be returned by the GraphQL queries. It also contains the definitions for the queries. In order to communicate with the MongoDB, the server uses the `mongoose` package. It connects to the `MONGODB_URI` stored as an environment variable (covered in the [Heroku deployment](#heroku-deployment) section), or if you're working locally, it connects to the local instance of the database. (Currently this is called `clinical_trials_test` but can be changed depending on your local instance). The syntax to query the MongoDB is very simple. The mongoose documentation to describe how to query the database can be found [here](https://mongoosejs.com/docs/guide.html).

At the end of the `index.js` file, the GraphQL server is created, the server uses express to serve the client and then start the GraphQL server.


## Database Description
All the data in the database as of now comes from clinicaltrials.gov. The data can be downloaded [here](https://clinicaltrials.gov/ct2/resources/download). The database contains all clinical trials data as of **07/15/2019**.

The current database for the clinical trials data has 5 collections.

1. `full_trials`
2. `trials`
2. `interventions`
3. `outcomes`
4. `publications`

### full_trials

`full_trials` contains important fields for each trial.

```python
full_trials:
1. _id
2. nct_id #unique ID for the trial
3. brief_title
4. overall_status #e.g. recruiting, active
5. enrollment
6. start_date
7. primary_completion_date
8. countries #an array of involved countries
9. study_first_submitted
10. last_update_submitted
11. last_update_posted
12. references # publications
13. results_references # publications
```

### trials
`trials` contains aggregate information for each possible condition

```python
1. _id
2. condition
3. studies # i.e. number of studies
4. nct_ids # array of all the nct_ids for this condition
5. sctid # snomed id
```
Note: the `sctid` is only available for a fraction of relevant conditions. The aim of using the SNOMED ID was to consolidate conditions with different string values for the names, but are in effect the same condition. The effort to incorporate SNOMED IDs was not completed in this version of the database.


### interventions

`interventions` contains one entry for each unique intervention/condition combination

```python
interventions:
1. _id
2. condition
3. intervention_type
4. intervention_name
5. count
6. nct_ids # associated trials with this intervention
7. sctid # snomed id
```
Note: the `sctid` is only available for a fraction of relevant conditions. The aim of using the SNOMED ID was to consolidate conditions with different string values for the names, but are in effect the same condition. The effort to incorporate SNOMED IDs was not completed in this version of the database.


### outcomes

`outcomes` contains one entry for each unique outcome/condition combination

```python
1. _id
2. condition
3. measure
4. count
5. nct_ids # associated trials with this outcome
6. time_frame
```

### publications

`publications` contains information for each piece of citation information across all trials.

```python
1. _id
2. pmid
3. nct_id
4. condition
5. citation
6. type # e.g. reference or results_reference
```
I'm not entirely clear on the distinction between reference and results_reference, but in case that becomes relevant I included the information for each entry.

## Python Scripts
In order to extract the data from the many, many XML files downloaded from clinicaltrials.gov and put it in the Mongo database, a number of Python scripts have been written. The purpose of each one will be covered here.

Note that each script that involves creating documents from scratch offers the option to drop the collection altogether before running. This allows you to start fresh if needed, but also allows you to add onto the database if you have a folder of entirely new entries. It's probably possible to make the scripts smart enough to detect whether it's seeing duplicate data to eliminate this prompt, but in their current state it's up to the user to know whether it's providing unique data or not.

#### `full_trials.py`
Traverses through the directory and extracts information out of each XML file for the [full_trials](#full_trials) database. When running, it requires two arguments:
1. the database name to insert the data into
2. the root directory of all the XML files

#### `trials.py`
Traverses through the directory and extracts information out of each XML file for the [trials](#trials) database. When running, it requires two arguments:
1. the database name to insert the data into
2. the root directory of all the XML files

#### `interventions.py`
Traverses through the directory and extracts information out of each XML file for the [interventions](#interventions) database. When running, it requires two arguments:
1. the database name to insert the data into
2. the root directory of all the XML files

#### `outcomes.py`
Traverses through the directory and extracts information out of each XML file for the [outcomes](#outcomes) database. When running, it requires two arguments:
1. the database name to insert the data into
2. the root directory of all the XML files

#### `publications.py`
Traverses through the directory and extracts information out of each XML file for the [publications](#publications) database. When running, it requires two arguments:
1. the database name to insert the data into
2. the root directory of all the XML files

Note that for this script, because each `full_trial` entry is unique based on NCT ID, if you run this script on data that has already been entered, it will fail. You will need to drop the collection if you want to rerun it on data you've already done.

#### `aggregation.py`
This script updates entries in the database (in all collections) to have an sctid. The sctid (SNOMED ID) is used to aggregate together conditions whose string names are different but are medically the same. For example "depression" and "depressive disorder" will have the same sctid. This script takes as arguments:
1. database name
2. csv file with column 1 being condition names and column 2 being the sctid for these conditions


## Bash Scripts

#### `populate_mongo.sh`
This script takes as arguments:
1. database name
2. root directory of all the clinical trials XML files
3. directory of csv files of condition-sctid information

The script drops all collections in the database and starts from scratch populating the entire thing. It runs each of the python scripts mentioned above.

#### `sctid.sh`
This script takes as arguments:
1. database name
2. directory of csv files of condition-sctid information

The script runs only `aggregation.py` for a set of csv files. This is useful if you have a number of sctid csvs and want to update the database all at once, without scrapping everything else.



## Additional Notes

1. Why are `conditionSingle` and `conditions_sctid` separate queries but `interventions` and `outcomes` takes both the condition and potential sctid in order to get the count?
    - The `trials` database stores an individual record for each unique _condition_ name and therefore already contains the number of studies for that condition. A separate query is needed to find all the conditions with the given `sctid` and aggregate the number of studies from each record. The `interventions` database stores an individual record for each unique _intervention and condition combination_. For example, there would be one record for "therapy, depression" and another for "therapy, anxiety." Each record also stores an sctid if it exists. Therefore, one query can be used to aggregate all interventions for a given condition _or_ sctid because the records will need to be aggregated regardless. The same logic for interventions applies to `outcomes`.
