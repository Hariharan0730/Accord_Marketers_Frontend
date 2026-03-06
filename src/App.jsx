import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import API from "./api/axios";

import Layout from "./components/Layout";
import AdminLayout from "./admin/components/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import SingleBlog from "./pages/SingleBlog";
import CaseStudies from "./pages/CaseStudies";
import SingleCaseStudy from "./pages/SingleCaseStudies";
import Contacts from "./admin/pages/Contacts";
import Dashboard from "./admin/pages/Dashboard";
import CaseStudy from "./admin/pages/CaseStudy";
import Blogs from "./admin/pages/Blogs";
import CreateBlog from "./admin/pages/CreateBlog";
import EditBlog from "./admin/pages/EditBlog";
import CreateCaseStudy from "./admin/pages/CreateCaseStudy";
import EditCaseStudy from "./admin/pages/EditCaseStudy";
import ActivityLog from "./admin/pages/ActivityLog";
import Settings from "./admin/pages/Settings";

import Login from "./admin/pages/Login";
import ForgotPassword from "./admin/pages/ForgotPassword";
import ResetPassword from "./admin/pages/ResetPassword";

import ProtectedRoute from "./admin/components/ProtectedRoute";

export default function App() {

  
  useEffect(() => {

    const loadSiteTitle = async () => {
      try {

        const { data } = await API.get("/api/settings/public");

        if (data?.website?.siteTitle) {
          document.title = data.website.siteTitle;
        }

      } catch (err) {
        console.log("Site title load failed");
      }
    };

    loadSiteTitle();

  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        
        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<SingleBlog />} />

          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<SingleCaseStudy />} />

        </Route>


        
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />


        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/create" element={<CreateBlog />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
          <Route path="case-studies" element={<CaseStudy />} />
          <Route path="case-studies/create" element={<CreateCaseStudy />} />
          <Route path="case-studies/edit/:id" element={<EditCaseStudy />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="settings" element={<Settings />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}