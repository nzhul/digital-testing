# Digital Factory Testing module

POC for Complete UI Automation Testing of websites created by the Digital Factory.

The module will include features like:

- Automatic test case generation
  + each widget (form, listview, content block, navigation, etc.) will generate basic test cases that can be executed based on its functionality
  + by opening a page, each of the dragged widgets will 'report' all test cases that can be executed on them by specifying element ID, control type and sample data for each step of the test case
  + the gathered information will be displayed as possible test cases that can be edited, enriched or reduced.
- Regression test suites generation and execution
  + all test cases collected can be organized in suites
  + the test suites can be scheduled for execution on a daily basis or on demand
  + test reports with video recordings and screenshots for failed tests will be sent over email or can be reviewed in the Digital Factory
- User scenarios automation based on all generated test cases for each page
  + the user can specify User scenarios that concern more than one page or functionality (login + navigate to forums + create a forum post)
- Upload of existing automation - the user can upload his existing UI automation code and take advantage of the test execution scheduling and reporting
- LIVE website user scenario monitoring (Heartbeat tests)
  + short user scenarios like login, logout, navigation, etc. can be added for execution on LIVE every 10, 15 or 30 minutes

This functionality will be a key benefit when testing Sitefinity upgrades for Digital factory websites. The clients using this feature will be able to rapidly create regression UI Test suites and execute them without worrying about the whole infrastructure behind such a setup.
