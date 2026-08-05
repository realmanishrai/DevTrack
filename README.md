# DevTrack



🤝 GitHub Collaboration Guide



This project is being developed collaboratively. If you're not comfortable with Git/GitHub yet, follow this guide.



«Golden Rule: Never work directly on "main". Create your own branch, make your changes there, and open a Pull Request.»



\---



1\. Clone the Repository



You only need to do this once, when setting up the project on your computer.



git clone <repository-url>



Then enter the project folder:



cd <project-folder>



Example:



git clone https://github.com/username/project-name.git

cd project-name



\---



🔄 Daily Workflow



The basic workflow is:



Pull latest changes

&#x20;     ↓

Create / switch to your branch

&#x20;     ↓

Write code

&#x20;     ↓

Commit changes

&#x20;     ↓

Pull latest changes again

&#x20;     ↓

Push your branch

&#x20;     ↓

Open Pull Request

&#x20;     ↓

Review \& Merge



\---



2\. Always Pull Before You Start



Before starting new work, make sure your local "main" branch is up to date.



git switch main

git pull origin main



This downloads the latest changes made by everyone else.



Do not skip this.



\---



3\. Create a New Branch



Never develop directly on "main".



Create a branch for the feature or bug you're working on:



git switch -c <branch-name>



Example:



git switch -c feature/login-page



Other examples:



feature/signup

feature/dashboard

feature/search

fix/navbar

fix/login-error

docs/readme-update



Use descriptive branch names so everyone knows what the branch is for.



\---



4\. Check Which Branch You're On



Before coding, you can check your current branch with:



git branch



The branch with "\*" next to it is your current branch.



Example:



&#x20; main

\* feature/login-page



\---



5\. Make Your Changes



Now write your code normally.



When you're ready to save your work to Git, first check what changed:



git status



This shows modified, deleted, and untracked files.



\---



6\. Stage Your Changes



To stage everything:



git add .



Or stage a specific file:



git add filename



Example:



git add src/Login.jsx



You can check what is staged with:



git status



\---



7\. Commit Your Changes



Create a commit:



git commit -m "your commit message"



Example:



git commit -m "Add login form validation"



Good commit messages



Add login page

Fix navbar alignment

Add password validation

Update database schema

Remove unused API call



Bad commit messages



changes

stuff

update

asdf

final

final-final

working now



Keep commits small and meaningful.



\---



⚠️ 8. Pull Before You Push



This is one of the most important rules when working as a team.



Other people may have changed the project while you were working.



Before pushing your branch, update your local "main":



git switch main

git pull origin main



Then switch back to your branch:



git switch <your-branch>



Example:



git switch feature/login-page



Now bring the latest "main" changes into your branch:



git merge main



If there are no conflicts, you're good to continue.



If Git reports merge conflicts, resolve them before pushing.



After resolving conflicts:



git add .

git commit -m "Resolve merge conflicts"



\---



🚀 9. Push Your Branch



The first time you push a new branch:



git push -u origin <branch-name>



Example:



git push -u origin feature/login-page



After that, you can usually just use:



git push



\---



🔀 10. Open a Pull Request (PR)



After pushing your branch:



1\. Open the repository on GitHub.

2\. GitHub will usually show a Compare \& pull request button.

3\. Click it.

4\. Make sure the PR is:



base: main  ←  compare: your-branch



5\. Add a clear title describing what you changed.

6\. Add a short description if necessary.

7\. Click Create Pull Request.



Example PR title:



Add user login page



Example description:



\- Added login form

\- Added email/password validation

\- Added error messages

\- Connected form to login API



Do not merge immediately if the changes are significant. Let another team member review them first.



\---



👀 11. Review and Merge



Another team member should check the Pull Request.



Check that:



\- The code works.

\- Existing features aren't broken.

\- There aren't unnecessary files or changes.

\- The code is understandable.

\- There are no obvious







🛠️ Project Setup Guide



This project contains two separate applications:



\- Frontend: React

\- Backend: FastAPI + SQLAlchemy



Both servers need to be running during development.



📁 Project Structure



project/

│

├── frontend/

│   ├── src/

│   ├── public/

│   ├── package.json

│   └── ...

│

├── backend/

│   ├── app/

│   │   ├── main.py

│   │   └── ...

│   ├── requirements.txt

│   └── ...

│

├── .gitignore

└── README.md



\---



⚛️ Frontend Setup — React



Prerequisites



Make sure you have installed:



\- Node.js

\- npm

\- Git



Check that Node.js and npm are available:



node --version

npm --version



If both commands print version numbers, you're good.



\---



1\. Go to the Frontend Directory



From the project root:



cd frontend



\---



2\. Install Dependencies



Run:



npm install



This installs all dependencies listed in "package.json".



«Run "npm install" after cloning the project and whenever new dependencies have been added by another teammate.»



Do not share or commit the "node\_modules" folder.



\---



3\. Configure Environment Variables



If the frontend requires environment variables, create:



frontend/.env



For a Vite project, frontend environment variables must normally start with "VITE\_".



Example:



VITE\_API\_URL=http://localhost:8000



Then access it in React using:



const apiUrl = import.meta.env.VITE\_API\_URL;



«Never put passwords, private API keys, database credentials, or other secrets in frontend environment variables. Anything sent to the browser should be considered public.»



If the repository contains an ".env.example", copy it and fill in the required values.



\---



4\. Start the Frontend Server



Run:



npm run dev



Vite will display the local development URL, usually:



http://localhost:5173



Open it in your browser.



Keep this terminal running while working on the frontend.



\---



📦 Adding a New Frontend Package



If you need a new dependency:



npm install <package-name>



Example:



npm install axios



This updates:



package.json

package-lock.json



Commit both files when adding or changing dependencies.



Other frontend developers can then simply run:



npm install



to install the new dependency.



\---



🐍 Backend Setup — FastAPI + SQLAlchemy



Prerequisites



Make sure you have installed:



\- Python

\- pip

\- Git



Check your installation:



python --version

pip --version



Depending on your system, you may need:



python3 --version

pip3 --version



\---



1\. Go to the Backend Directory



From the project root:



cd backend



\---



2\. Create a Virtual Environment



Each backend developer should create their own Python virtual environment.



Windows



python -m venv .venv



Activate it:



.venv\\Scripts\\activate



macOS / Linux



python3 -m venv .venv



Activate it:



source .venv/bin/activate



After activation, your terminal should usually show something similar to:



(.venv)



«Always activate the virtual environment before installing packages or running the backend.»



Do not commit ".venv/" to Git.



\---



3\. Install Backend Dependencies



With the virtual environment activated:



pip install -r requirements.txt



This installs FastAPI, SQLAlchemy, Uvicorn, and the other required backend dependencies.



Run this after initially cloning the repository or whenever "requirements.txt" changes.



\---



4\. Configure Environment Variables



Create:



backend/.env



The actual variables depend on the project.



For example:



DATABASE\_URL=sqlite:///./app.db



Or, if the project later uses PostgreSQL:



DATABASE\_URL=postgresql://username:password@localhost:5432/database\_name



There may also be other variables:



SECRET\_KEY=your-secret-key



⚠️ Never commit ".env"



The real ".env" file may contain passwords, API keys, database credentials, and other secrets.



Instead, the repository should contain:



.env.example



For example:



DATABASE\_URL=

SECRET\_KEY=



Whenever you add a new required environment variable, also update ".env.example".



\---



5\. Start the Backend Server



Assuming the FastAPI instance is located in:



backend/app/main.py



and looks like:



fro

