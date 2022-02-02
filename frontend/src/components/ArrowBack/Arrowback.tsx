import { Box } from "@chakra-ui/react";

import { IoMdArrowBack } from "react-icons/io";

export type ArrowBackProps = {
  onClick: () => void;
};

/**
 * Componente da interface para voltar à tela anterior
 * @param param0 { onClick: função executada quando ocorre um click}
 * @returns
 */
export const ArrowBack = ({ onClick }: ArrowBackProps) => {
  return (
    <Box
      cursor="pointer"
      _hover={{ opacity: "0.6" }}
      position="fixed"
      top="20px"
      left="20px"
      onClick={onClick}
    >
      <IoMdArrowBack size="30px" />
    </Box>
  );
};
