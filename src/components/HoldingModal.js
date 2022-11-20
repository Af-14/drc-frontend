import * as React from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  createTheme,
  makeStyles,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyle = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    backgroundColor: "#121212",
    color: "white",
    boxShadow: 24,
    borderRadius: 10,
  },
}));

export default function HoldingModal({ coin }) {
  const { currency, setAlert, watchlist, user } = CryptoState();

  const [openHolding, setOpenHolding] = React.useState(false);
  const [newHolding, setNewHolding] = React.useState(0);
  const [newHolding2, setNewHolding2] = React.useState(0);

  const handleOpen = () => setOpenHolding(true);
  const handleClose = () => setOpenHolding(false);

  const setHoldingWatchlist = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.map((watch) =>
            watch.id === coin?.id
              ? { id: coin.id, holding: newHolding2 }
              : { id: watch.id, holding: watch.holding }
          ),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `You have change your ${coin?.name} holding to ${newHolding} ${currency} (${newHolding2} unit)`,
        type: "success",
      });
    } catch (error) {}
  };
  const handleSubmit = () => {
    if (!newHolding) {
      setAlert({
        open: true,
        message: "Please fill in the required information",
        type: "error",
      });
    }
    if (newHolding < 0) {
      setAlert({
        open: true,
        message: "Invalid Input",
        type: "error",
      });
    }
    setHoldingWatchlist();
    handleClose();
  };

  const classes = useStyle();

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  React.useEffect(() => {
    setNewHolding2(
      newHolding / coin?.market_data?.current_price[currency.toLowerCase()]
    );
  }, [newHolding]);

  console.log("coin", coin);

  const holdingPlaceHolder = `Enter Holding amount in ${currency}`;
  return (
    <>
      {" "}
      <ThemeProvider theme={darkTheme}>
        <Button
          variant="contained"
          onClick={handleOpen}
          style={{
            backgroundColor: "#FFE227",
            color: "black",
            fontFamily: "VT323",
            fontSize: 10,
            padding: 0,
          }}
        >
          Edit
        </Button>
        <Modal open={openHolding} onClose={handleClose}>
          <div className={classes.paper}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginLeft: "50px",
                marginRight: "50px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              {" "}
              <Box style={{ display: "flex", gap: 10 }}>
                <Typography>
                  1 {coin?.name} ={" "}
                  {coin?.market_data?.current_price[currency.toLowerCase()]}
                  {currency}
                </Typography>
                <TextField
                  variant="outlined"
                  type="number"
                  label={holdingPlaceHolder}
                  value={newHolding}
                  onChange={(e) => setNewHolding(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  style={{ backgroundColor: "yellow", color: "black" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </div>
        </Modal>
      </ThemeProvider>
    </>
  );
}
