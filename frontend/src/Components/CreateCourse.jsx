import React, { useState } from "react";
import axios from "axios";

const CreateCourse = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: user._id,
    isPaid: false,
    price: "",
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    video: null,
    pdf: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFiles({ ...files, [name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!user || !user._id) {
      setMessage("Instructor information is missing.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      for (const key in files) {
        if (files[key]) {
          data.append(key, files[key]);
        }
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/course/courses",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("Course created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        instructor: user._id,
        isPaid: false,
        price: "",
      });
      setFiles({ thumbnail: null, video: null, pdf: null });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create course. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create a New Course</h1>
      {message && <div className="text-center text-red-500 mb-4">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Inputs */}
        <div>
          <label className="block text-lg text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Course Title"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-lg text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter Course Description"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-lg text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter Course Category"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Paid Course Option */}
        <div className="flex items-center space-x-4">
          <label className="text-lg text-gray-700">Paid Course?</label>
          <input
            type="checkbox"
            name="isPaid"
            checked={formData.isPaid}
            onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div>
          <label className="block text-lg text-gray-700 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter Course Price"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!formData.isPaid}
          />
        </div>

        {/* File Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-lg text-gray-700 mb-2">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              onChange={handleFileChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg cursor-pointer"
            />
            {files.thumbnail && (
              <div className="mt-2">
                <h3 className="text-gray-700">Thumbnail Preview:</h3>
                <img src={URL.createObjectURL(files.thumbnail)} alt="Thumbnail Preview" className="w-full h-48 object-cover mt-2" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-lg text-gray-700 mb-2">Video</label>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg cursor-pointer"
            />
            {files.video && (
              <div className="mt-2">
                <h3 className="text-gray-700">Video Preview:</h3>
                <video controls className="w-full h-48 mt-2">
                  <source src={URL.createObjectURL(files.video)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          <div>
            <label className="block text-lg text-gray-700 mb-2">PDF</label>
            <input
              type="file"
              name="pdf"
              onChange={handleFileChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg cursor-pointer"
            />
            {files.pdf && (
              <div className="mt-2">
                <h3 className="text-gray-700">PDF Preview:</h3>
                <object data={URL.createObjectURL(files.pdf)} type="application/pdf" className="w-full h-48 mt-2">
                  <p>Your browser does not support PDF previews.</p>
                </object>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
