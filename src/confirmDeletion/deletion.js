import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} 
    PaperProps={{
        sx: { width: 450, height: 300 }}}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <InfoIcon color="error" sx={{ fontSize: 50}} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center", marginTop: 2 }}>
          <Typography variant="h4" sx={{ fontSize: "1.8rem", marginBottom: 1 }}>
          Are you sure you want to delete?
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
          You won&apos;t be able to revert this.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button onClick={onConfirm} color="primary" variant="contained">
        Yes, delete it!
        </Button>
        <Button onClick={onClose} color="error" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
