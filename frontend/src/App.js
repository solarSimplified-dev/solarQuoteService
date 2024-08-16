import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Moon, Sun } from 'lucide-react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.error || 'Failed to upload file');
      setUploadResult(null);
    } finally {
      setUploading(false);
    }
  };

  const renderJsonResult = (json) => {
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (error) {
        // If parsing fails, treat it as a plain string
        return <span>{json}</span>;
      }
    }
    
    if (typeof json !== 'object' || json === null) {
      return <span>{JSON.stringify(json)}</span>;
    }
    return (
      <ul className="list-disc pl-4">
        {Object.entries(json).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {renderJsonResult(value)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Solar Quote System</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full"
        >
          {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </header>
      
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Solar Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                  Select File
                </label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={!file || uploading} className="w-full">
                {uploading ? 'Uploading...' : 'Upload and Process'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-destructive mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}
            {uploadResult ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processed Data:</h3>
                  {uploadResult.processedResult ? (
                    renderJsonResult(uploadResult.processedResult)
                  ) : (
                    <p className="text-muted-foreground">No processed result available.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">File URL:</h3>
                  <a href={uploadResult.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {uploadResult.fileUrl}
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Processed results will appear here.</p>
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-secondary text-secondary-foreground p-4 mt-8">
        <p className="text-center">&copy; 2024 Solar Quote System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;