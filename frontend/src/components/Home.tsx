import { Flex, Button, Input, Heading } from "@chakra-ui/react";
import { useRef } from "react";

export const Home = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Flex alignItems="center" flexDirection="column">
      <Heading marginBottom="30px">
        Trabalho 01 - Inteligência Artificial
      </Heading>
      <Input
        display="none"
        onChange={(e) => {
          console.log("File selected");
          if (e.target.files !== null) {
            const fileContent = e.target.files[0].text;
          }
        }}
        ref={inputRef}
        type="file"
      />
      <Button
        w="300px"
        onClick={() => inputRef.current?.click()}
        colorScheme="purple"
      >
        Selecionar arquivo
      </Button>
    </Flex>
  );
};
