import React from "react";
import { Button, Flex, Skeleton, Stack, Text, Title } from "@mantine/core";
import { Avatar } from "@tapsioss/react-components";
import Link from "next/link";
import pbClient from "@/client/pbClient";
import { capitalizeName } from "@/utils/string";

type Props = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  url?: string;
};

const PreviewBase = ({ imageUrl, title, subtitle, url }: Props) => {
  return (
    <Link href={url || ""} passHref>
      <Stack align="center">
        {imageUrl && (
          <Avatar size="xlg" color="initials" image={imageUrl} alt={title} />
        )}
        {title && (
          <Title ta="center" size="sm">
            {title}
          </Title>
        )}
        {subtitle && <Text ta="center">{subtitle}</Text>}
      </Stack>
    </Link>
  );
};

PreviewBase.Loading = function Loading({
  imageUrl,
  title,
  subtitle,
  url,
}: Props) {
  return (
    <Stack align="center">
      <Skeleton width={84} height={84} circle />
      <Skeleton width={100} height={20} />
      <Skeleton width={90} height={20} />
    </Stack>
  );
};

PreviewBase.Compact = function Compact({ imageUrl, title, url }: Props) {
  return (
    <Button
      size="compact-md"
      variant="transparent"
      color="gray.4"
      style={{
        paddingInline: 0,
      }}
    >
      <Link href={url || ""} passHref>
        <Flex gap="xs">
          <Avatar image={imageUrl} size="xs" />
          <Text fw={500} size="sm" lh="1.5rem">
            {title}
          </Text>
        </Flex>
      </Link>
    </Button>
  );
};

export default PreviewBase;
