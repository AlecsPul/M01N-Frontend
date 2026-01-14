import {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  Box,
  Text,
  VStack,
  Separator,
  Heading,
  Grid,
} from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import type { ComparisonResponse, ApplicationComparison } from "../../services/comparisonService";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ComparisonResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

const AttributeRow = ({
  label,
  hasA,
  hasB,
}: {
  label: string;
  hasA: boolean;
  hasB: boolean;
}) => (
  <Grid
    templateColumns="1fr 2fr 1fr"
    gap={4}
    py={3}
    borderBottom="1px solid"
    borderColor="gray.100"
    alignItems="center"
  >
    <Box textAlign="center">
      {hasA ? (
        <FaCheck color="green" style={{ margin: "0 auto" }} />
      ) : (
        <FaTimes color="red" style={{ margin: "0 auto" }} />
      )}
    </Box>

    <Text textAlign="center" fontSize="sm" fontWeight="medium">
      {label}
    </Text>

    <Box textAlign="center">
      {hasB ? (
        <FaCheck color="green" style={{ margin: "0 auto" }} />
      ) : (
        <FaTimes color="red" style={{ margin: "0 auto" }} />
      )}
    </Box>
  </Grid>
);

const HighlightsSection = ({
  app,
  side,
}: {
  app: ApplicationComparison;
  side: "left" | "right";
}) => (
  <VStack align={side === "left" ? "flex-end" : "flex-start"} gap={4} w="100%">
    {app.highlights.map((h, i) => (
      <Box
        key={i}
        p={3}
        bg={side === "left" ? "blue.50" : "purple.50"}
        borderRadius="md"
        w="100%"
      >
        <Text
          fontWeight="bold"
          fontSize="sm"
          mb={1}
          color={side === "left" ? "blue.700" : "purple.700"}
        >
          {h.title}
        </Text>
        <Text fontSize="xs" color="gray.600">
          {h.detail}
        </Text>
      </Box>
    ))}
  </VStack>
);

export default function ComparisonModal({
  isOpen,
  onClose,
  data,
  isLoading,
  error,
}: ComparisonModalProps) {
  // Keep behavior: don't render when nothing to show and not open
  if (!isOpen && !data && !isLoading && !error) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      // If your project uses focus trapping defaults, this is usually fine.
      // If you hit focus issues, you can add: modal
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="4xl" maxH="90vh">
          <DialogHeader 
            bg="gray.50" 
            borderBottom="1px solid" 
            borderColor="gray.200"
            py={4}
            position="relative"
            minH="60px"
          >
            <DialogCloseTrigger 
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              borderRadius="md"
              width="32px"
              height="32px"
              fontSize="lg"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="absolute"
              top="14px"
              right="16px"
            >
              ✕
            </DialogCloseTrigger>
          </DialogHeader>

          <DialogBody pb={6} overflowY="auto">
            {isLoading && (
              <Box py={10} textAlign="center">
                <Text>Analyzing and comparing...</Text>
              </Box>
            )}

            {error && (
              <Box py={10} textAlign="center" color="red.500">
                <Text>Error: {error}</Text>
              </Box>
            )}

            {data && !isLoading && (
              <VStack gap={8} align="stretch">
                {/* Header / Titles */}
                <Grid templateColumns="1fr 1fr" gap={6}>
                  <VStack>
                    <Heading size="2xl" color="blue.600" fontWeight="bold">
                      {data.company_a.name}
                    </Heading>
                  </VStack>
                  <VStack>
                    <Heading size="2xl" color="purple.600" fontWeight="bold">
                      {data.company_b.name}
                    </Heading>
                  </VStack>
                </Grid>

                {/* AI Highlights */}
                <Box>
                  <Text
                    fontSize="md"
                    textTransform="uppercase"
                    fontWeight="bold"
                    color="gray.500"
                    mb={4}
                    textAlign="center"
                  >
                    AI Generated Highlights
                  </Text>
                  <Grid templateColumns="1fr 1fr" gap={6}>
                    <HighlightsSection app={data.company_a} side="left" />
                    <HighlightsSection app={data.company_b} side="right" />
                  </Grid>
                </Box>

                <Separator />

                {/* Attributes Comparison */}
                <Box>
                  <Text
                    fontSize="md"
                    textTransform="uppercase"
                    fontWeight="bold"
                    color="gray.500"
                    mb={4}
                    textAlign="center"
                  >
                    Attributes & Integrations
                  </Text>

                  <Box bg="gray.50" p={2} borderRadius="md">
                    {/* Header Row */}
                    <Grid templateColumns="1fr 2fr 1fr" gap={4} mb={2} px={2}>
                      <Text
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="bold"
                        color="gray.500"
                      >
                        {data.company_a.name}
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="bold"
                        color="gray.500"
                      >
                        Feature
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="bold"
                        color="gray.500"
                      >
                        {data.company_b.name}
                      </Text>
                    </Grid>

                    {/* Combined Attribute Rows */}
                    {data.company_a.attributes.map((attr, idx) => {
                      const attrB = data.company_b.attributes[idx];
                      return (
                        <AttributeRow
                          key={idx}
                          label={attr.value}
                          hasA={attr.has}
                          hasB={attrB?.has ?? false}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </VStack>
            )}
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
