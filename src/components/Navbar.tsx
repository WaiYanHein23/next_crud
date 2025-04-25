import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Navbar = ({ onAddClick }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#435d7d",
        height: "100px",
        color: "#fff",
        mb: 2,
        borderRadius: "4px 4px 0 0",
      }}
    >
      <Grid container textAlign={"right"} spacing={40} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h4">
            NextJS-MySQL{" "}
            <Box component="span" fontWeight="bold">
              CRUD
            </Box>
          </Typography>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ textTransform: "none" }}
          >
            Add New Employee
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Navbar;
