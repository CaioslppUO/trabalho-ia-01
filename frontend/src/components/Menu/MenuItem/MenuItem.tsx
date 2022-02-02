import { Flex, Button } from "@chakra-ui/react";

type MenuItemProps = {
  title: string;
  onClick?: () => void;
};

/**
 * Component that represents a menu option
 * @param param0 Options of the item
 * @returns React component
 */
export const MenuItem = ({ title = "Item Title", onClick }: MenuItemProps) => {
  return (
    <Flex alignItems="center" flexDirection="column" marginBottom="20px">
      <Button onClick={onClick} w="300px" colorScheme="purple">
        {title}
      </Button>
    </Flex>
  );
};
