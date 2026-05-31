import React from 'react';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import ArticlesPage from './pages/ArticlesPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                   <Route path="/" element={<HomePage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/lessons" element={<LessonsPage />} />
                    <Route path="/lessons/:id" element={<LessonDetailPage />} />
                    <Route path="/tests/:testId" element={<TestPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;