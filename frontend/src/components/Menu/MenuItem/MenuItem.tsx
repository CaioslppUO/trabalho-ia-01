import { Flex, Button, FlexProps } from "@chakra-ui/react";

interface MenuItemProps extends FlexProps {
  title: string;
  onClick?: () => void;
}

/**
 * Component that represents a menu option
 * @param param0 Options of the item
 * @returns React component
 */
export const MenuItem = ({
  title = "Item Title",
  onClick,
  ...props
}: MenuItemProps) => {
  return (
    <Flex alignItems="center" marginX="10px" marginBottom="20px" {...props}>
      <Button onClick={onClick} w="300px" colorScheme="purple">
        {title}
      </Button>
    </Flex>
  );
};
