// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYgbVrq1nYTWtF5N9Aco1ZLFXHm3oLpZ8",
  authDomain: "todo-liste-4ad4a.firebaseapp.com",
  projectId: "todo-liste-4ad4a",
  storageBucket: "todo-liste-4ad4a.appspot.com",
  messagingSenderId: "889132134613",
  appId: "1:889132134613:web:ea0a65516f5b289179f25c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Funksjon for å laste oppgaver fra Firestore og vise dem i DOM-en
function loadTasks() {
  const q = query(collection(db, "TodoItems"), orderBy("timestamp", "desc"));
  onSnapshot(q, (querySnapshot) => {
    // Tømmer oppgavelisten
    taskList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const task = doc.data();

      // Lager et nytt div-element for oppgaven
      const taskItem = document.createElement('div');
      taskItem.className = 'task';
      if (task.completed) {
        taskItem.classList.add('completed');
      }
      taskItem.dataset.id = doc.id;

      // Oppgavetekst
      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;
      taskItem.appendChild(taskText);

      // Lager en sletteknapp
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.className = 'delete-task';
      deleteButton.dataset.id = doc.id;
      taskItem.appendChild(deleteButton);

      // Legger oppgaven til oppgavelisten i DOM-en
      taskList.appendChild(taskItem);
    });
  });
}

// Funksjon for å legge til en oppgave i Firestore
function addTask(task) {
  addDoc(collection(db, "TodoItems"), {
    text: task,
    completed: false,
    timestamp: new Date() // Timestamp, for rekkefølge på oppgavene
  }).catch((error) => {
    console.error("Error adding task: ", error);
  });
}

function deleteTask(taskId) {
  const taskRef = doc(db, "TodoItems", taskId);
  deleteDoc(taskRef).catch((error) => {
    console.error("Error deleting task: ", error);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  if (task) {
    addTask(task);
    taskInput.value = ''; // Tøm input-feltet
  }
});

// Eventlistener for sletting av oppgaver
taskList.addEventListener('click', (e) => {
  const taskId = e.target.dataset.id;
  if (e.target.classList.contains('delete-task')) {
    deleteTask(taskId);
  } else {
  }
});

// Laster inn oppgavene når siden lastes
loadTasks();