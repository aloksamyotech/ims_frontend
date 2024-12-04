import { useState, useEffect } from 'react';
import { Stack, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Container, Typography, Card, Box, Dialog } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUnit from './addUnit.js';
import UpdateUnit from './updateUnit.js';
import ViewUnit from './viewUnit.js';
import { deleteUnit, fetchUnits } from 'apis/api.js';
import Swal from 'sweetalert2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Unit = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [unitData, setUnitData] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);

  useEffect(() => {
    const loadUnits = async () => {
      const response = await fetchUnits();
      setUnitData(response?.data);
    };
    loadUnits();
  }, []);

  const CustomToolbar = ({ handleOpenAdd }) => {
    return (
      <GridToolbarContainer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <GridToolbarQuickFilter
          placeholder="Search..."
          style={{
            width: '250px',
            backgroundColor: '#ffff',
            borderRadius: '8px',
            padding: '5px 10px',
            border: '1px solid beige',
          }}
        />
        <Stack direction="row" spacing={2} alignItems="center">
        <GridToolbarExport sx={{ fontSize: 25 }} />
          <Tooltip title="Add Unit" arrow>
            <IconButton
              onClick={handleOpenAdd}
              sx={{
                backgroundColor: '#1e88e5',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 3,
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  color: '#ffffff'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </GridToolbarContainer>
    );
  };

  const columns = [
    { field: 'unitnm', headerName: 'Unit Name', flex: 1 },
    { field: 'shortcode', headerName: 'Short Code', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row">
          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleView(params.row._id)}
              color="primary"
              sx={{
                '&:hover': {
                  backgroundColor: '#9abfdd', 
                  color: '#1976d2' 
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              color="secondary"
              sx={{
                '&:hover': {
                  backgroundColor: '#d7cde6',
                  color: '#512995' 
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row?._id)}
              color="error"
              sx={{
                '&:hover': {
                  backgroundColor: '#ffcccc',
                  color: '#d32f2f'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      )
    }
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
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteUnit(_id);
        setUnitData((prev) => prev.filter((unit) => unit?._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your unit has been deleted.", 
          "success"  
        );
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
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
      <Box
          sx={{
            marginTop: '20px',
            backgroundColor: '#ffff',
            padding: '12px',          
            borderRadius: '8px', 
            width: '100%',          
            display: 'flex',         
            alignItems: 'center',  
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3">Unit Lists</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Classifications</Typography>
            <Typography color="text.primary">Unit</Typography>
          </Breadcrumbs>
          </Box>

         <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600pxs', paddingTop: '5px', marginTop: '25px', overflow: 'auto' }}>
              <DataGrid
                rows={unitData}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{
                  Toolbar: () => <CustomToolbar handleOpenAdd={handleOpenAdd} />
                }}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 }
                  }
                }}
                pagination
                sx={{
                  '& .MuiDataGrid-root': {
                    border: 'none'
                  },
                  '& .MuiDataGrid-row': {
                    borderBottom: '1px solid #ccc'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold'
                  }
                }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Unit;
