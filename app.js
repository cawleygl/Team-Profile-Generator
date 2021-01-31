const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

let idNum = 2;
let allEmployees = [];
let engAmt = 0;
let intAmt = 0;
let html = "";

askInitial = () => {
    console.log("Let's get started!");
    inquirer
        .prompt([
            { type: "input", name: "mgrName", message: "What is the team manager's name?" },
            { type: "input", name: "mgrEmail", message: "What is their email address?" },
            { type: "input", name: "mgrOffice", message: "What is their office number?" },
            { type: "number", name: "engAmt", message: "How many Engineers are on the team?" },
            { type: "number", name: "intAmt", message: "How many Interns are on the team?" }

        ])
        .then(val => {

            const manager = new Manager(val.mgrName, 1, val.mgrEmail, val.mgrOffice);
            allEmployees.push(manager);

            engAmt = val.engAmt
            intAmt = val.intAmt

            if (engAmt == 0 && intAmt == 0) {
                renderAndPrint();
            } else if (isNaN(engAmt) || isNaN(intAmt)) {
                console.log("Please enter a numerical value for the amount of engineers and interns on the team.");
            } else if (engAmt == 0) {
                console.log("Let's start with the interns.");
                askIntern();
            } else {
                console.log("Let's start with the engineers.");
                askEngineer();
            }
        })
};

askEngineer = () =>
    inquirer
        .prompt([
            { type: "input", name: "engName", message: "Please enter the name of an Engineer on the team:" },
            { type: "input", name: "engEmail", message: "What is their email address?" },
            { type: "input", name: "engGithub", message: "What is their GitHub username?" },
        ])
        .then(val => {

            const engineer = new Engineer(val.engName, idNum, val.engEmail, val.engGithub);
            allEmployees.push(engineer);

            engAmt--;
            idNum++;

            if (engAmt > 0) {
                console.log("On to the next engineer!");
                askEngineer();
            } else if (intAmt == 0) {
                renderAndPrint();
            } else {
                console.log("That's all the engineers, now for the interns!");
                askIntern();
            }
        });


askIntern = () =>
    inquirer
        .prompt([
            { type: "input", name: "intName", message: "Please enter the name of an Intern on the team:" },
            { type: "input", name: "intEmail", message: "What is their email address?" },
            { type: "input", name: "intSchool", message: "What school did they attend?" },
        ])
        .then(val => {

            const intern = new Intern(val.intName, idNum, val.intEmail, val.intSchool);
            allEmployees.push(intern);

            intAmt--;
            idNum++;

            if (intAmt > 0) {
                console.log("On to the next intern!")
                askIntern();
            } else {
                renderAndPrint();
            }
        })

renderAndPrint = () => {

    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!

    console.log("That's everyone!")
    html = render(allEmployees);

    // After you have your html, you're now ready to create an HTML file using the HTML
    // returned from the `render` function. Now write it to a file named `team.html` in the
    // `output` folder. You can use the variable `outputPath` above target this location.
    // Hint: you may need to check if the `output` folder exists and create it if it
    // does not.

    fs.writeFile(outputPath, html, (err) =>
        err ? console.error(err) : console.log('Success! Team Profile written to team.html!')
    );

    idNum = 2;
    allEmployees = [];
    engAmt = 0;
    intAmt = 0;

};

askInitial();

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
