import { Flex, Button, Input, Heading } from "@chakra-ui/react";
import { useContext, useRef } from "react";
import toast from "react-hot-toast";
import { MainContext } from "../contexts/Main";
import api from "../services/api";

export const Home = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMainGraph, setTab } = useContext(MainContext);

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
            const reader = new FileReader();
            reader.readAsText(e.target.files[0], "UTF-8");
            reader.onload = function (evt) {
              if (evt.target != null) {
                api
                  .post("read-file", {
                    file_content: evt.target.result,
                  })
                  .then((r) => {
                    console.log("File uploaded");
                    toast.success("Arquivo selecionado com sucesso!");
                    console.log(r.data);
                    setMainGraph(r.data);
                    setTab(2);
                  })
                  .catch((e) => {
                    console.log("Error in file upload", e);
                    toast.error("Erro ao selecionar arquivo");
                  })
                  .finally(() => {
                    e.target.value = "";
                  });
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
        Selecionar arquivo
      </Button>
    </Flex>
  );
};
