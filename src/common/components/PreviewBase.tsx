import { Button, Flex, Skeleton, Stack, Text, Title } from "@mantine/core";
import { Avatar } from "@tapsioss/react-components";
import Link from "next/link";

type Props = {
  imageUrl: string | null;
  title?: string;
  subtitle?: string;
  url?: string;
  noLink?: boolean;
};

const PreviewBase = ({ imageUrl, title, subtitle, url }: Props) => {
  return (
    <Link passHref href={url || ""}>
      <Stack align="center">
        {imageUrl && (
          <Avatar alt={title} color="initials" image={imageUrl} size="xlg" />
        )}
        {title && (
          <Title size="sm" ta="center">
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
      <Skeleton circle height={84} width={84} />
      <Skeleton height={20} width={100} />
      <Skeleton height={20} width={90} />
    </Stack>
  );
};

PreviewBase.Compact = function Compact({ imageUrl, title, url, noLink }: Props) {
  const view = (
    <Flex gap="xs">
        {imageUrl && <Avatar image={imageUrl} size="xs" />}
        <Text fw={500} lh="1.5rem" size="sm">
          {title}
        </Text>
      </Flex>
  )
  if (noLink) {
    return view
  }
  return (
    <Link passHref href={url || ""} onClick={(e) => e.stopPropagation()}>
      {view}
    </Link>
  );
};

export default PreviewBase;
