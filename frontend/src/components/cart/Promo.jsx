import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    CircularProgress
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
    setPromoInput,
    validatePromoCode
} from "../../store/cartSlice";

export default function Promo() {

    const dispatch = useDispatch();

    const promoInput = useSelector((s) => s.cart.promoInput);
    const { status, message, isValid } = useSelector((s) => s.cart.promo);

    const handleApply = () => {
        dispatch(validatePromoCode(promoInput));
    };



    return (

        <Box sx={{ px: 2, py: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
                Apply Promotion Code
            </Typography>

            <Stack direction="row" spacing={1}>
                <TextField
                    size="small"
                    placeholder="20 DOLLAR OFF"
                    value={promoInput}
                    onChange={(e) => dispatch(setPromoInput(e.target.value))}
                    disabled={status === "loading"}
                    sx={{
                        width: 180,
                    }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    onClick={handleApply}
                    disabled={status === "loading"}
                    sx={{
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        bgcolor: "#4b47ff",
                        py: 1.4,
                        fontWeight: 700,
                        "&:hover": { bgcolor: "#3c38ff" },
                    }}
                >
                    {status === "loading" ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CircularProgress size={16} color="inherit" />
                            <Typography fontSize={13} fontWeight={600}>
                                Checking…
                            </Typography>
                        </Stack>
                    ) : (
                        "Apply"
                    )}
                </Button>
            </Stack>

            {message && (
                <Typography
                    sx={{ mt: 0.75, fontSize: 12.5, fontWeight: 500, letterSpacing: 0.2 }}
                    color={isValid ? "success.main" : "error.main"}
                >
                    {message}
                </Typography>
            )}
        </Box>
    )

}