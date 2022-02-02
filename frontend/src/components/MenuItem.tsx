import { Flex, Button, Input, Heading } from "@chakra-ui/react";
import { useRef } from "react";

type MenuItemProps = {
  title: string;
  onClick?: () => void;
};

export const MenuItem = ({ title = "Item Title", onClick }: MenuItemProps) => {
  return (
    <Flex alignItems="center" flexDirection="column" marginBottom="20px">
      <Button onClick={onClick} w="300px" colorScheme="purple">
        {title}
      </Button>
    </Flex>
  );
};
