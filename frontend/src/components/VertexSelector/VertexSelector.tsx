import { Flex, Heading, Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/Main";
import { GraphVisualizer } from "../GraphVisuzlizer/GraphVisualizer";
import { MenuItem } from "../Menu/MenuItem/MenuItem";

export const VertexSelector = ({
  title = "",
  onSelect = (a: string) => {},
}) => {
  const { visualGraph, MainGraph } = useContext(MainContext);

  return (
    <Flex
      width="100vw"
      maxWidth={"90vw"}
      overflowY={"scroll"}
      css={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
      alignItems={"center"}
      flexDirection={"column"}
      paddingY={"20vh"}
    >
      <Flex w="70%" flexDirection="column" alignItems={"center"}>
        <Heading marginBottom="30px">{title}</Heading>
        <Flex justifyContent={"center"} wrap={"wrap"} w="100%">
          {MainGraph.graph &&
            MainGraph.graph.map((i) => {
              return (
                <MenuItem
                  key={i.vertex.name}
                  title={i.vertex.name}
                  onClick={() => onSelect(i.vertex.name)}
                />
              );
            })}
        </Flex>
      </Flex>

      <GraphVisualizer showData={visualGraph} />
    </Flex>
  );
};
