import { useState, useEffect } from 'react';
import { Stack, Button, IconButton ,Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddUnit from './addUnit.js';
import UpdateUnit from './updateUnit.js';
import Iconify from '../../ui-component/iconify';
import { toast } from 'react-toastify';
import { deleteUnit, fetchUnits } from 'apis/api.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewUnit from './viewUnit.js';

const Unit = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [unitData, setUnitData] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);

  useEffect(() => {
    const loadUnits = async () => {
      const response = await fetchUnits();
      setUnitData(response.data);
    };
    loadUnits();
  }, []);

  const columns = [
    { field: 'unitnm', headerName: 'Unit Name', flex: 1 },
    { field: 'shortcode', headerName: 'Short Code', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
         <Box
          sx={{backgroundColor: '#e3f2fd', borderRadius: '8px',padding: '8px', paddingTop:'8 px','&:hover': { backgroundColor: '#bbdefb' },
               display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
           <IconButton size="small" onClick={() => handleView(params.row)} color="primary" sx={{ padding: 0 }}>
           <VisibilityIcon />  </IconButton>
          </Box>
          <Box sx={{ backgroundColor: '#fff3e0', borderRadius: '8px', padding: '8px',paddingTop:'8 px', '&:hover': { backgroundColor: '#ffe0b2' },
           display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon sx={{ color: '#ff9800' }} />
            </IconButton>
          </Box>
          <Box sx={{ backgroundColor: '#ffebee', borderRadius: '8px', padding: '8px',paddingTop:'8 px', '&:hover': { backgroundColor: '#ef9a9a' } ,
           display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
            <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setCurrentUnit(null);
    setOpenAdd(true);
  };

  const handleView = (unit) => {
    setCurrentUnit(unit);
    setOpenView(true);
  };

  const handleEdit = (unit) => {
    setCurrentUnit(unit);
    setOpenUpdate(true);
  };

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      await deleteUnit(_id);
      setUnitData((prev) => prev.filter((unit) => unit._id !== _id));
      toast.success('Unit deleted successfully');
    }
  };

  const handleUnitAdded = (newUnit) => {
    setUnitData((prev) => [...prev, newUnit]);
    setOpenAdd(false);
  };

  const handleUnitUpdated = (updatedUnit) => {
    setUnitData((prev) => prev.map((unit) => (unit._id === updatedUnit._id ? updatedUnit : unit)));
    setOpenUpdate(false);
  };

  return (
    <>
      <AddUnit open={openAdd} handleClose={() => setOpenAdd(false)} onUnitAdded={handleUnitAdded} />
      <UpdateUnit open={openUpdate} handleClose={() => setOpenUpdate(false)} unit={currentUnit} onUnitUpdated={handleUnitUpdated} />
      <ViewUnit  open={openView} handleClose={() => setOpenView(false)} unit={currentUnit} />
      <Container>
    
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4"  paddingTop={5}>Unit Lists</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2} marginTop={3}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add Unit
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
        <Box width="100%" overflow="hidden">
              <Card style={{ height: '600px', paddingTop: '15px', overflow: 'hidden' }}> 
                <div style={{ height: '100%', width: '100%', overflow: 'auto' }}> 
            <DataGrid
              rows={unitData}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              stickyHeader
              style={{ minWidth: '800px'}} 
            />
            </div>
          </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Unit;
