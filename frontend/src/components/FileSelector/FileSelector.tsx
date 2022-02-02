import { Flex, Button, Input, Heading } from "@chakra-ui/react";
import { useRef } from "react";

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

  return (
    <Flex alignItems="center" flexDirection="column">
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
              }
            };
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
