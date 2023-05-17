import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bcrypt from "bcrypt";
import pg from "pg";
import jwt from "jsonwebtoken";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();

app.use(express.json());

// app.use(cors())

//User authentication
// post request, as this will create jwt tokens 
app.post('/login', (req,res)=> {

  const uesername=req.body.uesername
  const user = {name: username}
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken:accessToken })
})



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// // Set up the PostgreSQL connection
// const pool = new Pool({
//   user: 'your_database_user',
//   host: 'your_database_host',
//   database: 'your_database_name',
//   password: 'your_database_password',
//   port: 5432,
// });

// app.get("/api/tasks", async (req, res, next) => {
//   const result = await db.query("SELECT * FROM tasks").catch(next);
//   res.send(result.rows);
// });

// app.get("/api/tasks/:id", async (req, res, next) => {
//   const result = await db
//     .query("SELECT * FROM tasks WHERE id = $1", [req.params.id])
//     .catch(next);

//   if (result.rows.length === 0) {
//     res.sendStatus(404);
//   } else {
//     res.send(result.rows[0]);
//   }
// });

// app.post("/api/tasks", async (req, res, next) => {
//   const { description } = req.body;

//   const result = await db
//     .query("INSERT INTO tasks(description) VALUES ($1)", [description])
//     .catch(next);
//   res.send(result.rows[0]);
// });

// app.delete("/api/tasks/:id", async (req, res, next) => {
//   const { id } = req.params;

//   await db.query("DELETE FROM tasks WHERE id = $1", [id]).catch(next);
//   res.sendStatus(204);
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Internal Server Error");
// });

//-----------------------------------------ROUTES(SINGULAR NON JOINT)--------------------------------------------------//

// --------------------- Users routes ----------------------------- // 

app.post('/register', async (req, res) => {
  try {
    const { name, email, admin, password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    const testUsername = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (testUsername.rows[0]) {
      res.status(409).send({ 'message': 'Email already exists' });
    } else {
      const { rows } = await pool.query('INSERT INTO users (name, email, password, admin) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, hashedPwd, admin]);
      if (rows[0].email){
        res.status(201).send({ 'message': 'Account successfully registered!'})
      } else {
        res.status(500).send({ 'message': 'Internal Error' })
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ 'message': error });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await pool.query('SELECT email, password FROM users WHERE email = $1', [email]);
    if (!response.rows[0]) {
      res.status(404).send({ 'message': 'User not found'})
    } else if (await bcrypt.compare(password, response.rows[0].password)) {
      const token = jwt.sign({ email: response.rows[0].email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })
      res.status(200).send({ token });
    } else {
      res.status(409).send({ 'message': 'Incorrect Password'})
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



// --------------------- Students routes ----------------------------- //
app.get('/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/students/:cohort_id', async (req, res) => {
  const { cohort_id } = req.params;
  try {
    const { rows } = await pool.query('SELECT students.id AS id, stu_name, email, github, cohort_id, cohort_number, graduation, instructor FROM students INNER JOIN cohorts ON (students.cohort_id = cohorts.id) WHERE cohorts.cohort_number = $1', [cohort_id]);
    res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/students', async (req, res) => {
  try {
    const { stu_name, email, gitHub, cohort_number } = req.body;
    const response = await pool.query('SELECT id FROM cohorts WHERE cohort_number = $1', [cohort_number]);
    const id = response.rows[0].id;
    const { rows } = await pool.query('INSERT INTO students (stu_name, email, github, cohort_id) VALUES ($1, $2, $3, $4) RETURNING *', [stu_name, email, gitHub, id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}); 

app.put('/students/:id', async (req, res) => {
  try {
    const stuID = req.params.id;
    const { stu_name, email, gitHub, cohort_number } = req.body;
    const response = await pool.query('SELECT id FROM cohorts WHERE cohort_number = $1', [cohort_number]);
    const id = response.rows[0].id;
    const { rowCount } = await pool.query('UPDATE students SET stu_name = $1, email = $2, github = $3, cohort_id = $4 WHERE id = $5', [stu_name, email, gitHub, id, stuID]);
    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// --------------------------- Cohorts routes -------------------------------------//
app.get('/cohorts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cohorts');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/cohorts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM cohorts WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/cohorts', async (req, res) => {
  try {
    const { cohort_number, start, graduation, instructor } = req.body;
    const { rows } = await pool.query('INSERT INTO cohorts (cohort_number, start, graduation, instructor) VALUES ($1, $2, $3, $4) RETURNING *', [cohort_number, start, graduation, instructor]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/cohorts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cohort_number, start, graduation, instructor } = req.body;
    const { rowCount } = await pool.query('UPDATE cohorts SET cohort_number = $1, start = $2, graduation = $3, instructor = $4 WHERE id = $5', [cohort_number, start, graduation, instructor, id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


app.delete('/cohorts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM cohorts WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//----------------- Groups routes -----------------------//
app.get('/groups', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM groups');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/groups', async (req, res) => {
  try {
    const { group_name, student1, student2, student3, student4, student5, student6 } = req.body;
    const { rows } = await pool.query('INSERT INTO groups (group_name, student1, student2, student3, student4, student5, student6) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [group_name, student1, student2, student3, student4, student5, student6]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { group_name, student1, student2, student3, student4, student5, student6 } = req.body;
    const { rowCount } = await pool.query('UPDATE groups SET group_name = $1, student1 = $2, student2 = $3, student3 = $4, student4 = $5, student5 = $6, student6 = $7 WHERE id = $3', [group_name, student1, student2, student3, student4, student5, student6, id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM groups WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// ----------------- Project routes ----------------------//
app.get('/project', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM project');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM project WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/project', async (req, res) => {
  try {
    const { project_name, type} = req.body;
    const { rows } = await pool.query('INSERT INTO project (project_name, type) VALUES ($1, $2) RETURNING *', [project_name, type]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { project_name, type} = req.body;
    const { rowCount } = await pool.query('UPDATE project SET project_name = $1, type = $2 WHERE id = $3', [project_name, type, id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM project WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
// ----------------- Project Scores routes ----------------------//
app.get('/project_scores', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM project_scores');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/project_scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM project_scores WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/project_scores', async (req, res) => {
  try {
    const { group_id, project_id, grade, cohort_id } = req.body;
    const { rows } = await pool.query('INSERT INTO project_scores (group_id, project_id, grade, cohort_id) VALUES ($1, $2, $3, $4) RETURNING *', [group_id, project_id, grade, cohort_id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/project_scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { group_id, project_id, grade, cohort_id} = req.body;
    const { rowCount } = await pool.query('UPDATE project_scores SET group_id = $1, project_id = $2, grade = $3, cohort_id = $4 WHERE id = $5', [group_id, project_id, grade, cohort_id, id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/project_scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM project_scores WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// ----------------- Assessments routes --------------------- //
app.get('/assessments', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM assessments');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM assessments WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/assessments', async (req, res) => {
  try {
    const { assess_name, type } = req.body;
    const { rows } = await pool.query('INSERT INTO assessments (assess_name, type) VALUES ($1, $2) RETURNING *', [assess_name, type]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assess_name, type } = req.body;
    const { rowCount } = await pool.query('UPDATE assessments SET assess_name = $1, type = $2 WHERE id = $4', [assess_name, type, id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM assessments WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// ---------------- Assessment Scores routes --------------------- //
app.get('/assessment_scores', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM assessment_scores');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/assessment_scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM assessment_scores WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/assessment_scores', async (req, res) => {
  try {
    const { student_id, assess_id, grade, cohort_id } = req.body;
    const { rows } = await pool.query('INSERT INTO assessment_scores (student_id, assess_id, grade, cohort_id) VALUES ($1, $2, $3) RETURNING *', [student_id, assess_id, grade, cohort_id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/assessment_scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, assess_id, grade, cohort_id } = req.body;
    const { rowCount } = await pool.query('UPDATE assessment_scores SET student_id = $1, assess_id = $2, grade = $3, cohort_id = $4, WHERE id = $5', [student_id, assess_id, grade, cohort_id, id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/assessment_scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM assessment_scores WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// ---------------- Projects routes ----------------------//
app.get('/projects', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/projects', async (req, res) => {
  try {
    const { project_name, type } = req.body;
    const { rows } = await pool.query('INSERT INTO projects (project_name, type ) VALUES ($1, $2) RETURNING *', [project_name, type ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { project_name, type } = req.body;
    const { rowCount } = await pool.query('UPDATE projects SET project_name = $1, type = $2 WHERE id = $3', [project_name, type , id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// new joint table route for Student, Project name and Project_Score
//get route that will put the above data

app.get('/student_project_scores', async (req, res) => {
  try {
    const query = `
      SELECT 
        students.stu_name AS student_name,
        projects.project_name AS project_name,
        project_scores.grade AS project_score
      FROM 
        students
      JOIN 
        project_scores ON students.id = project_scores.group_id
      JOIN 
        projects ON project_scores.project_id = projects.id
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/student_project_scores/:cohort_id', async (req, res) => {
  try {
    const { cohort_id } = req.params;
    const query = `
    SELECT groups.group_name AS group_name,
groups.student1 AS student1,
groups.student2 AS student2,
groups.student3 AS student3,
groups.student4 AS student4,
groups.student5 AS student5,
groups.student6 AS student6,
projects.project_name AS project_name,
project_scores.grade AS project_score,
cohorts.cohort_number AS cohort_number
FROM groups 
JOIN 
project_scores ON groups.id = project_scores.group_id
JOIN 
projects ON project_scores.project_id = projects.id 
JOIN 
cohorts ON project_scores.cohort_id = cohorts.id WHERE cohorts.cohort_number = $1`;
    const { rows } = await pool.query(query, [cohort_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

export default app;


