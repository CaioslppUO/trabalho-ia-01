import { Flex, Heading, Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/Main";
import { GraphVisualizer } from "../MainVisuzalizer/GraphVisualizer";
import { MenuItem } from "../Menu/MenuItem/MenuItem";

export const VertexSelector = ({
  title = "",
  onSelect = (a: string) => {},
}) => {
  const { visualGraph, MainGraph } = useContext(MainContext);

  return (
    <Flex
      width="90vw"
      maxWidth={"90vw"}
      overflowY={"scroll"}
      css={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
      alignItems={"center"}
    >
      <Flex w="50%" flexDirection="column" alignItems={"center"}>
        <Heading marginBottom="30px">{title}</Heading>
        <Flex justifyContent={"center"} wrap={"wrap"} w="100%">
          {MainGraph.graph &&
            MainGraph.graph.map((i) => {
              return (
                <MenuItem
                  width={"100px"}
                  key={i.vertex.name}
                  title={i.vertex.name}
                  onClick={() => onSelect(i.vertex.name)}
                />
              );
            })}
        </Flex>
      </Flex>

      <Box w="50%">
        <GraphVisualizer width={600} showData={visualGraph} />
      </Box>
    </Flex>
  );
};
