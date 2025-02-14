# Description
<!--
  This is a template to add as much information as possible to the pull request, to help reviewer and as a checklist for you. Points to remember are set in the comments, please read and keep them in mind:

    - Code should be self-explanatory and share your knowledge with others
    - Document code that is not self-explanatory
    - Think about bugs and keep security in mind
    - Write tests (Unit and end-to-end-tests), also for error cases
    - Business logic should be implemented in the API; never trust the client
    - Visible changes should be discussed with the UX-Team from the beginning of development; they also have to accept them at the end
    - Keep the changelog up-to-date
    - Leave the code cleaner than you found it. Remove unnecessary lines. Listen to the linter.
-->

## Links to Tickets or other pull requests
<!--
Base links to copy
- https://github.com/schul-cloud/schulcloud-server/pull/????
- https://ticketsystem.dbildungscloud.de/browse/BC-????
-->

## Changes
<!--
  What will the PR change?
  Why are the changes required?
  Short notice if a ticket exists, more detailed if not
-->

## Data Security
<!--
  Notice about:
  - model changes
  - logging of user data
  - right changes
  - and other user data stuff
  If you are not sure if it is relevant, take a look at confluence or ask the data security team.
-->

## Deployment
<!--
  Keep in mind to changes to seed data, if changes are done by migration scripts.
  Changes to the infrastructure have to discussed with the devops

  This point should include following information:
  - What is required for deployment?
  - Environment variables like FEATURE_XY=true
  - Migration scripts to run, other requirements
-->

## New Repos, NPM packages or vendor scripts
<!--
  Keep in mind the stability, performance, activity and author.

  Describe why it is needed.
-->

## Screenshots of UI changes
<!--
  only needed for visual changes

  If visual changes exist, work together with UI/UX from beginning/ping UX with final PR
-->

## Approval for review

- [ ] QA: In addition to review, the code has been manually tested (if manual testing is possible)
- [ ] All points were discussed with the ticket creator, support-team or product owner. The code upholds all quality guidelines from the PR-template.

> Notice: Please remove the WIP label if the PR is ready to review, otherwise nobody will review it.
