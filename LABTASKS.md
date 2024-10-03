# Lab Tasks <!-- omit in toc -->

- [Getting started](#getting-started)
- [Exploring the project](#exploring-the-project)
- [Overview of the lab](#overview-of-the-lab)
  - [Features to implement](#features-to-implement)
- [Workflow and Continuous Integration](#workflow-and-continuous-integration)
- [Writing todos to the Database](#writing-todos-to-the-database)
- [Display todos](#display-todos)

## Getting started

- [X] Remember to set up your project on GitHub Projects with your stories and estimates
- [X] Turn in the URL of the GitHub repository for your group in Canvas. This will make it easier for us to figure out which team is "Snoozing Llamas".

Definitely ask if you're ever confused about what you need to do for a given task.

## Exploring the project

The structure of this project should be nearly identical to that of Lab 3, and as such there really isn't much excitement in that department.

The structure of the server is, for the most part, the same as it has been in the past two labs. The difference to look for here is in how the server gets the data it sends out in reply to requests.

Spend some time looking over the project with these questions in mind. (Unlike the previous labs, however, you do _not_ need to write up and turn in your answers to these questions.)

- [ ] What do we do in the `Main`, `Server` and `UserController` classes
- [ ] to set up our connection to the development database?
- [ ] How do we retrieve a user by ID in the `UserController.getUser(Context...)` method?
- [ ] How do we retrieve all the users with a given age
- [ ] in `UserController.getUsers(Context...)`? What's the role of
- [ ] the variables `combinedFilter` and `sortingOrder` in that method?
- [ ] What is happening in the `UserControllerSpec.setUpEach()` method?
- [ ] What's being tested in `UserControllerSpec.canGetUsersWithAge37()`?
- [ ] How is that test implemented?
- [ ] Follow the process for adding a new user. What role does `UserController` play in the process?

## Overview of the lab

- Re-implement the todo API, this time pulling data from MongoDB rather than from a flat JSON file. The new elements of this lab are primarily in the MongoDB interaction, which is mostly in the Java server code (including `TodoController.java`).
- When displaying the todos in your Angular front-end, make thoughtful decisions about whether work like filtering
  should be done in Angular or via database queries. For example, you
  might have the database filter out all the todos belonging to a
  single user, but let Angular filter by category, body, or status.
- **Do at least some filtering on the database side of things.**

### Features to implement

- [x] Filter todos by status
- [x] Filter todos by owner
- [x] Filter todos by contents of the body
- [x] Filter todos by category
- [x] Combinations of filters
- [x] Sort by a todo field (status, owner, body contents, or category)
- [ ] Limit the number of todos returned
- [ ] Ability to add new todos. This requires:
  - [ ] An Angular form/page that allows the user to enter the information for a new todo with reasonable controls and validation.
  - [ ] A new endpoint on the server that allows clients to add new todos.
  - [ ] Logic in the server to add that new todo to the database and return the new ID.
- [ ] Testing of all of the above.
- [ ] Display the todos in a reasonable way using at least two nifty Angular Material features from [here](https://material.angular.io/components/categories)!

## Workflow and Continuous Integration

You should organize your work into features, where each feature is a (small) story in GitHub Projects. Each feature should "slice the cake", including server implementation and testing, Angular implementation and testing, and end-to-end testing.

:warning: Keep the features as small and focussed as
possible. Otherwise things like code reviews become a huge burden,
and pull requests become far less useful.

To maximize your learning, we strongly encourage you to implement features in Angular one at a time instead of copying over
entire components from the previous lab that presumably support numerous features.

Make sure you do frequent commits with useful commit messages.
If you're pair programming (which we definitely recommend!) make
sure include [a co-authorship line in the commit message](https://docs.github.com/en/github/committing-changes-to-your-project/creating-a-commit-with-multiple-authors) so the
person you're working with gets credit. These have the form:

```text
 Co-authored-by: Connie Stewart <conniestewart@ohmnet.com>
```

where you replace the name ("Connie Stewart") and email
("conniestewart@ohmnet.com") with the name and email of the
person you're pairing with.

- [ ] As you work, create a branch for each new feature.
  - Write tests for the server actions for the feature you added. Run
    them to make sure they fail. Then write the server code that
    makes those tests pass.
  - Write new end-to-end tests for the new views
    using Cypress. Run these to make sure they fail.
  - Write unit tests for the new Angular components you are adding
    using Karma. Run them to make sure they also fail. Then write the
    Angular code that makes those unit and integration/e2e tests pass.
  - Address failing builds.
- [ ] Perform code reviews, especially if you're not pair programming.
  _Ask (your partner, the class, the instructor) about things you don't understand!_
- [ ] Use pull requests to
  merge things into `main` when a feature is working
  and is tested (with passing tests and decent coverage).

## Writing todos to the Database

- We have included an example of writing to the database with `addUser` functionality. Add
  functionality to both the front-end and back-end to make it possible to add todos so that
  they appear both in your list and in the database.

## Display todos

You should use Angular to display todos in attractive, readable, and useful ways that are helpful for understanding the nature of a todo.

- [ ] Use the Angular Material Design tools you've learned about to build a nice interface for
  accessing these APIs:
  - [ ] You must use at least two nifty Angular Material features from [here](https://material.angular.io/components/categories)!
  - There are many interesting tools - we encourage you to try several.
  - Feel free to borrow ideas and (preferably small bits of) code from the previous labs, but make
    sure you understand it. Also feel free to use this as an opportunity to improve the UI, perhaps
    taking advantages of ideas you had earlier but weren't able to implement then.
