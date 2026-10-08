import '@mui/material/Typography';
import '@mui/material/TextField';
import '@mui/material/Grid';
import '@mui/material/Drawer';
import '@mui/material/Dialog';
import '@mui/material/ListItemText';

declare module '@mui/material/Typography' {
  interface TypographyOwnProps {
    fontWeight?: number | string;
  }
}

declare module '@mui/material/TextField' {
  interface BaseTextFieldProps {
    InputProps?: any;
  }
}

declare module '@mui/material/Grid' {
  interface GridBaseProps {
    item?: boolean;
    container?: boolean;
    xs?: any;
    sm?: any;
    md?: any;
    lg?: any;
    spacing?: any;
    alignItems?: any;
    justifyContent?: any;
  }
}

declare module '@mui/material/Drawer' {
  interface DrawerProps {
    PaperProps?: any;
  }
}

declare module '@mui/material/Dialog' {
  interface DialogProps {
    PaperProps?: any;
  }
}

declare module '@mui/material/ListItemText' {
  interface ListItemTextOwnProps {
    primaryTypographyProps?: any;
  }
}
