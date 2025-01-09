import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Input ,Box} from '@mui/material';
import { toast } from 'react-toastify';
import { getUserId } from 'apis/constant.js';
import {addApi} from 'apis/common.js'; 

function FileInput() {
  const userId = getUserId();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        const formattedData = sheetData.map((product) => ({
          ...product,
          categoryId: product.categoryId || null,
          categoryName: product.categoryName || null,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.alert('Failed to read the Excel file. Please ensure it is a valid file.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const sendToBackend = async () => {
    try {
      const response = await addApi('/product/bulkUpload', {
        productsData: data.map((product) => ({
          ...product,
          userId: userId,
        })),
      });
      toast.success('Bulk upload successfully');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to upload data to the backend.');
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Bulk Upload
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h4">Upload Excel File</DialogTitle>
        <Divider />
        <DialogContent>
        <Box>
            <Button variant="contained" color="secondary" href="/sampleFile.xlsx" download sx={{ mb: 2 }}>
              Download Sample File
            </Button>
          </Box>

          <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} fullWidth sx={{ mb: 2 }} />
          {data && (
            <div>
              <h3>Imported Data:</h3>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={sendToBackend} color="secondary" disabled={!data}>
            Upload
          </Button>
          <Button variant="contained" onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FileInput;
