import { Flex, Button, Input, Heading } from "@chakra-ui/react";
import { useRef } from "react";
import { useToast } from "@chakra-ui/react";
const titleDefault = "Selecione um arquivo para continuar";
const btnTextDefault = "Selecionar arquivo";
const defaultFunction = (content: string | ArrayBuffer) => {};

/**
 * Componente usado para ler uma arquivo e tornar ele acessível
 * @returns React functional component
 */
export const FileSelector = ({
  title = titleDefault,
  onSelected = defaultFunction,
  btnText = btnTextDefault,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      w="100vw"
      h="100vh"
      justifyContent={"center"}
    >
      <Heading marginBottom="30px">{title}</Heading>
      <Input
        display="none"
        onChange={(e) => {
          console.log("File selected");
          if (e.target.files !== null) {
            const reader = new FileReader();
            reader.readAsText(e.target.files[0], "UTF-8");
            reader.onload = function (evt) {
              if (evt.target !== null && evt.target?.result !== null) {
                onSelected(evt.target.result);

                if (e.target.files) {
                  toast({
                    title: `Arquivo "${e.target.files[0].name}" selecionado.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }
            };
          } else {
            toast({
              title: "Arquivo não selecionado.",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
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
        {btnText}
      </Button>
    </Flex>
  );
};
