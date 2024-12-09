import { useEffect, useState } from 'react';
import { fetchSubscription } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent,TextField, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ViewSubscription = ({ open, handleClose, subscription }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      if (subscription) {
        try {
          const response = await fetchSubscription(subscription);
          setSubscriptionData(response?.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching subscription details:', error);
          setLoading(false);
        }
      }
    };
    loadSubscription();
  }, [subscription]);

  if (loading) return null;

  if (!subscription) return <div>subscription not found.</div>;

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
          <Typography variant="h3">View Subscription</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Title" variant="outlined" fullWidth margin="dense" value={subscription.title || 'NA'} sx={{marginBottom:2}} />
          <TextField autoFocus label="No of Days" variant="outlined" fullWidth margin="dense" value={subscription.noOfDays || 'NA'} sx={{marginBottom:2}} />
          <TextField autoFocus label="Amount" variant="outlined" fullWidth margin="dense" value={subscription.amount || 'NA'} sx={{marginBottom:2}} />
          <TextField autoFocus label="Discount(%)" variant="outlined" fullWidth margin="dense" value={subscription.discount || 'NA'} sx={{marginBottom:2}} />
          <TextField autoFocus label="Description" variant="outlined" fullWidth margin="dense" value={subscription.desc || 'NA'} sx={{marginBottom:2}}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewSubscription;
