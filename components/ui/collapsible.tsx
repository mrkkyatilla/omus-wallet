
import * as React from 'react';
import { Pressable, View } from 'react-native';

const CollapsibleContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(
  null
);

const Collapsible = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
> (({ ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <View ref={ref} {...props} />
    </CollapsibleContext.Provider>
  );
});

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable>
>(({ ...props }, ref) => {
  const { open, setOpen } = React.useContext(CollapsibleContext)!;
  return <Pressable ref={ref} onPress={() => setOpen(!open)} {...props} />;
});

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext)!;
  return open ? <View ref={ref} {...props}>{children}</View> : null;
});

export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
};
