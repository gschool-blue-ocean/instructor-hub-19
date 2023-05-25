import { test, expect } from '@playwright/test';

//variables representing user input
const nameInput = 'test name';
const emailInput = 'test@test.com';
const githubInput = 'testGithub';

test('sign in', async ({ page }) => {
  // will need to preface with the authentication modal
await page.goto('http://localhost:3000/');
await page.getByPlaceholder('Email Address').click();
await page.getByPlaceholder('Email Address').fill('ortiz123@example.com');
await page.getByPlaceholder('Email Address').press('Tab');
await page.getByPlaceholder('Password').fill('password');
await page.getByRole('button', { name: 'Sign In' }).click();
const signInBox = await page.isVisible('Sign InRegister')
expect(signInBox).toBe(false)

});

test('sign out', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('billytomasello1@gmail.com');
  await page.getByPlaceholder('Email Address').press('Tab');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  const signInBox = await page.isVisible('Sign InRegister')
 expect(signInBox).toBe(false)
});


test('invalid sign in attempt', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('afdskjjjsafd');
  await page.getByPlaceholder('Email Address').press('Tab');
  await page.getByPlaceholder('Password').fill('adsfafdsaf');
  await page.getByRole('button', { name: 'Sign In' }).click();
  const invalidlogin = await page.isVisible('.error-text')
  expect(invalidlogin).toBe(true)
});




test('projects button', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('billytomasello1@gmail.com');
  await page.getByPlaceholder('Email Address').press('Tab');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Projects' }).click();
  await page.getByText('MCSP-19 · ProjectsSelect a ProjectGroup nameStudentsProjectScoreYoshi\'s AngelsDa').click();
});


test('dashboard button goes back to dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('billytomasello1@gmail.com');
  await page.getByPlaceholder('Email Address').press('Tab');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Selected Cohort: 19' }).click();
  await page.getByText('MCSP - 19').click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
 const dashboard =  await page.isVisible('heading', { name: 'MCSP-19 · Students' })
});


test('create new cohort button shows up and goes away', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.fill('[placeholder="Email Address"]', 'billytomasello1@gmail.com');
  await page.press('[placeholder="Email Address"]', 'Tab');
  await page.fill('[placeholder="Password"]', 'password');
  await page.click('[role="button"]:has-text("Sign In")');
  await page.click('[role="button"]:has-text("Create New Cohort")');
  
  const newcohort = page.locator(':text("Cohort Number: Start Date: Graduation Date: Instructor Name:")');
  await newcohort.click();
  await page.click('[role="button"]:has-text("Cancel")');

  // check if the newcohort element is not visible
  expect(await newcohort.isVisible()).toBe(false);
});




test("Attempt at signing in with just invalid email (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("test");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with just invalid password (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("1234");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with just valid email (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("couch123@example.com");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with just valid password (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with invalid username & invalid password (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("afdskjjjsafd");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("adsfafdsaf");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with valid username & invalid password (unideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("couch123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("sgsdgsdg");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with valid username and valid email (ideal result)", async ({
  page,
}) => {
  // will need to preface with the authentication modal
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("ortiz123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  const signInBox = await page.isVisible("Sign InRegister");
  expect(signInBox).toBe(false);
});
​
test("Attempt at signing in with invalid email format and valid password (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("franky");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at signing in with invalid email and valid password (unideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("franky@gmail.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Register New User and attempt to Sign In After (unideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByPlaceholder("First and Last Name").click();
  await page.getByPlaceholder("First and Last Name").fill("Melvin Mudd");
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("Muddy123@gmail.com");
  await page.getByPlaceholder("Set Password").click();
  await page.getByPlaceholder("Set Password").fill("password");
  await page.getByPlaceholder("Verify Password").click();
  await page.getByPlaceholder("Verify Password").fill("password");
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("Muddy123gmail.com");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Sign out (ideal result)", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("ortiz123@example.ocm");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").press("Shift+Tab");
  await page.getByPlaceholder("Email Address").press("ArrowRight");
  await page.getByPlaceholder("Email Address").fill("ortiz123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  const signInPage = await page.isVisible("#login-root");
  expect(signInPage).toBe(true);
});
​
test("Attempt at deleting student from dashboard (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("couch123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page
    .getByRole("row", {
      name: "Shawn Couch Couch123@example.com https://github.com/Couch1 05/26/2023 19 Update trash can",
    })
    .getByRole("img", { name: "trash can" })
    .click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at updating student info on dashboard (unideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("couch123@example.com");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page
    .getByRole("row", {
      name: "Jesthen Baez Baez123@example.com https://github.com/Baez1 05/26/2023 19 Update trash can",
    })
    .getByRole("button", { name: "Update" })
    .click();
  await page.getByRole("cell", { name: "Baez123@example.com" }).click();
  await page
    .getByRole("row", {
      name: "Jesthen Baez Baez123@example.com https://github.com/Baez1 05/26/2023 19 Update trash can",
    })
    .getByRole("button", { name: "Update" })
    .click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Student is able to be added to cohort table (ideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  //sign in
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("ortiz123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  //
​
  //create variables here that will represent user input, will be compared to the text in the table
  const nameInput = "gandalf the grey";
  const emailInput = "gandalf@mordor.com";
  const githubInput = "gandalf123";
​
  await page.getByRole("button", { name: "Add Student" }).click();
  await page.getByPlaceholder("name...").click();
  await page.getByPlaceholder("name...").fill(nameInput);
  await page.getByPlaceholder("name...").press("Tab");
  await page.getByPlaceholder("email...").fill(emailInput);
  await page.getByPlaceholder("email...").press("Tab");
  await page.getByPlaceholder("github...").fill(githubInput);
  await page
    .locator("div")
    .filter({ hasText: /^Add StudentCancel$/ })
    .getByRole("button", { name: "Add Student" })
    .click();
  const nameCell = await page.$(".name-cell").innerText();
  const emailCell = await page.$(".email-cell").innerText();
  const githubCell = await page.$(".github-cell").innerText();
  await page.getByRole("cell", { name: "gandalf the grey" }).click();
  await page.getByRole("cell", { name: "gandalf@mordor.com" }).click();
  await page.getByRole("cell", { name: "gandalf123" }).click();
​
  expect(nameText).toBe(nameInput);
  expect(emailText).toBe(emailInput);
  expect(githubText).toBe(githubInput);
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at adding student modal which populates from button (worked in Chrome & Firefox but not Webkit)", async ({
  page,
}) => {
  // will need to preface with the authentication modal
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("ortiz123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "Dashboard" }).click();
  await page.getByRole("button", { name: "Add Student" }).click();
  const seeStudentModal = await page.isVisible(".student-modal-form");
  if (!seeStudentModal) {
    throw new Error("Add student modal did not appear");
  }
  // should be able to hit cancel button at any time that the user wants to drop the window, regadless of what info they have filled out
  // user should be able to
  await page.getByPlaceholder("name...").click();
  const nameValue = await page.getByPlaceholder("name...").fill(nameInput);
  await page.getByPlaceholder("name...").press("Tab");
  // make sure tab moves to the next column
  const emailValue = await page.getByPlaceholder("email...").fill(emailInput);
  await page.getByPlaceholder("email...").press("Tab");
  // make sure tab moves to the next column
  const githubValue = await page
    .getByPlaceholder("github...")
    .fill(githubInput);
  //make sure user input shows up in the table for the appropriate cohort
  // Make sure user input shows up in the table for the appropriate cohort
  if (
    (await page.isVisible(`text= ${nameInput}`)) &&
    (await page.isVisible(`text=${emailInput}`)) &&
    (await page.isVisible(`text= ${githubInput}`))
  ) {
  }
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});
​
test("Attempt at Clicking Assessments button (unideal result)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Email Address").click();
  await page.getByPlaceholder("Email Address").fill("couch123@example.com");
  await page.getByPlaceholder("Email Address").press("Tab");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "Assessments" }).click();
  const invalidlogin = await page.isVisible(".error-text");
  expect(invalidlogin).toBe(true);
});



// test('add student modal populates from button', async ({ page }) => {
//     // will need to preface with the authentication modal
//   await page.goto('http://localhost:3000/');
//   await page.getByPlaceholder('Email Address').click();
// await page.getByPlaceholder('Email Address').fill('ortiz123@example.com');
// await page.getByPlaceholder('Email Address').press('Tab');
// await page.getByPlaceholder('Password').fill('password');
// await page.getByRole('button', { name: 'Sign In' }).click();
//   await page.getByRole('button', { name: 'Dashboard' }).click();
//   await page.getByRole('button', { name: 'Add Student' }).click();
//   const seeStudentModal = await page.isVisible('.student-modal-form')
//     if(!seeStudentModal){
//             throw new Error('Add student modal did not appear')
//         }
// // should be able to hit cancel button at any time that the user wants to drop the window, regadless of what info they have filled out
// // user should be able to 
//   await page.getByPlaceholder('name...').click();
//   const nameValue = await page.getByPlaceholder('name...').fill(nameInput);
//   await page.getByPlaceholder('name...').press('Tab');
//   // make sure tab moves to the next column
//  const emailValue = await page.getByPlaceholder('email...').fill(emailInput);
//   await page.getByPlaceholder('email...').press('Tab');
//   // make sure tab moves to the next column
//  const githubValue =  await page.getByPlaceholder('github...').fill(githubInput);
// //make sure user input shows up in the table for the appropriate cohort
// // Make sure user input shows up in the table for the appropriate cohort
//     if (await page.isVisible(`text= ${nameInput}`) &&
//      await page.isVisible(`text=${emailInput}`) &&
//      await page.isVisible(`text= ${githubInput}`)){}
// });


// test('student is able to be added to cohort table', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   //sign in
//   await page.getByPlaceholder('Email Address').click();
//   await page.getByPlaceholder('Email Address').fill('ortiz123@example.com');
//   await page.getByPlaceholder('Email Address').press('Tab');
//   await page.getByPlaceholder('Password').fill('password');
//   await page.getByRole('button', { name: 'Sign In' }).click();

//   // create variables here that will represent user input, will be compared to the text in the table
//   const nameInput = 'rick astley';
//   const emailInput = 'astleyrick@gmail.com';
//   const githubInput = 'neverGonnaGitYouUp';

//   await page.getByRole('button', { name: 'Add Student' }).click();
//   await page.getByPlaceholder('name...').click();
//   await page.getByPlaceholder('name...').fill(nameInput);
//   await page.getByPlaceholder('name...').press('Tab');
//   await page.getByPlaceholder('email...').fill(emailInput);
//   await page.getByPlaceholder('email...').press('Tab');
//   await page.getByPlaceholder('github...').fill(githubInput);
//   await page.locator('div').filter({ hasText: /^Add StudentCancel$/ }).getByRole('button', { name: 'Add Student' }).click();

//   const nameCell = await page.getByText(nameInput);
//   const emailCell = await page.getByText(emailInput);
//   const githubCell = await page.getByText(githubInput);

//   expect(nameCell).toBeTruthy();
//   expect(emailCell).toBeTruthy();
//   expect(githubCell).toBeTruthy();
// });